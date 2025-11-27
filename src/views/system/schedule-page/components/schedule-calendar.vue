<template>
  <a-card
    class="schedule-calendar"
    :bordered="false"
    :body-style="{
      padding: '20px',
    }"
  >
    <template #title>
      <div class="calendar-header">
        <div class="doctor-info">
          <span class="doctor-label"
            >{{ $t('schedulePage.calendar.currentDoctor') }}:</span
          >
          <span class="doctor-name">
            {{
              selectedDoctorName || $t('schedulePage.calendar.noDoctorSelected')
            }}
          </span>
        </div>
        <a-space v-if="selectedDoctorId" size="medium">
          <a-button @click="prevWeek">
            <template #icon>
              <icon-left />
            </template>
            {{ $t('schedulePage.calendar.prevWeek') }}
          </a-button>
          <span class="week-label">{{ weekLabel }}</span>
          <a-button @click="nextWeek">
            {{ $t('schedulePage.calendar.nextWeek') }}
            <template #icon>
              <icon-right />
            </template>
          </a-button>
          <a-button type="primary" @click="goToThisWeek">
            {{ $t('schedulePage.calendar.thisWeek') }}
          </a-button>
          <a-button @click="handleCopySchedule">
            <template #icon>
              <icon-copy />
            </template>
            {{ $t('schedulePage.button.copySchedule') }}
          </a-button>
          <a-button @click="handleImportSchedule">
            <template #icon>
              <icon-import />
            </template>
            {{ $t('schedulePage.button.importSchedule') }}
          </a-button>
        </a-space>
      </div>
    </template>

    <a-spin :loading="loading" style="width: 100%">
      <a-empty
        v-if="!selectedDoctorId"
        :description="$t('schedulePage.calendar.selectDoctorTip')"
      />
      <div v-else class="calendar-grid">
        <!-- 表头：时间段 + 星期 -->
        <div class="calendar-header-row">
          <div class="time-cell header-cell">{{
            $t('schedulePage.calendar.timeSlot')
          }}</div>
          <div
            v-for="day in weekDays"
            :key="day.date"
            class="day-cell header-cell"
            :class="{ 'is-today': isToday(day.date) }"
          >
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ formatDate(day.date) }}</div>
          </div>
        </div>

        <!-- 表格内容：时间段 × 星期 -->
        <div
          v-for="period in timePeriods"
          :key="period.value"
          class="calendar-row"
        >
          <div class="time-cell">
            <div class="time-label">{{ period.label }}</div>
          </div>
          <div
            v-for="day in weekDays"
            :key="`${day.date}-${period.value}`"
            class="schedule-cell"
            @click="handleCellClick(day.date, period.value)"
          >
            <template v-if="getSchedule(day.date, period.value)">
              <div
                class="schedule-item"
                :class="getScheduleClass(getSchedule(day.date, period.value))"
              >
                <div class="schedule-type">
                  {{
                    getSlotTypeLabel(
                      getSchedule(day.date, period.value)!.slotType
                    )
                  }}
                </div>
                <div class="schedule-info">
                  <span
                    >{{ $t('schedulePage.calendar.totalSlots') }}:
                    {{ getSchedule(day.date, period.value)!.totalSlots }}</span
                  >
                  <span
                    >{{ $t('schedulePage.calendar.availableSlots') }}:
                    {{
                      getSchedule(day.date, period.value)!.availableSlots
                    }}</span
                  >
                </div>
                <div class="schedule-fee">
                  ¥{{ getSchedule(day.date, period.value)!.fee }}
                </div>
                <div class="schedule-actions">
                  <a-button
                    type="text"
                    size="mini"
                    @click.stop="
                      handleEdit(getSchedule(day.date, period.value)!)
                    "
                  >
                    <icon-edit />
                  </a-button>
                  <a-button
                    type="text"
                    size="mini"
                    status="danger"
                    @click.stop="
                      handleDelete(getSchedule(day.date, period.value)!)
                    "
                  >
                    <icon-delete />
                  </a-button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="empty-cell">
                <icon-plus />
              </div>
            </template>
          </div>
        </div>
      </div>
    </a-spin>

    <!-- 编辑排班弹窗 -->
    <ScheduleModal
      :visible="modalVisible"
      :schedule-id="currentScheduleId"
      :doctor-user-id="selectedDoctorId"
      :schedule-date="currentScheduleDate"
      :slot-period="currentSlotPeriod"
      @cancel="handleModalCancel"
      @success="handleModalSuccess"
    />

    <!-- 复制排班弹窗 -->
    <ScheduleCopyModal
      :visible="copyModalVisible"
      @cancel="handleCopyModalCancel"
      @success="handleCopyModalSuccess"
    />

    <!-- 导入排班弹窗 -->
    <ScheduleImportModal
      :visible="importModalVisible"
      :user-id="selectedDoctorId || 0"
      @cancel="handleImportModalCancel"
      @success="handleImportModalSuccess"
    />
  </a-card>
</template>

<script lang="ts" setup>
  /* eslint-disable no-use-before-define */
  import { computed, defineProps, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, Modal } from '@arco-design/web-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import useLoading from '@/hooks/loading';
  import {
    getAllSchedules,
    deleteSchedule,
    ScheduleListDTO,
  } from '@/api/schedule';
  import ScheduleModal from './schedule-modal.vue';
  import ScheduleCopyModal from './schedule-copy-modal.vue';
  import ScheduleImportModal from './schedule-import-modal.vue';

  dayjs.extend(isoWeek);

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);

  const props = defineProps({
    selectedDoctorId: {
      type: Number,
      default: 0,
    },
    selectedDoctorName: {
      type: String,
      default: '',
    },
  });

  // 时间段定义
  const timePeriods = [
    { value: 1, label: '08:00-08:30' },
    { value: 2, label: '08:30-09:00' },
    { value: 3, label: '09:00-09:30' },
    { value: 4, label: '09:30-10:00' },
    { value: 5, label: '10:00-10:30' },
    { value: 6, label: '10:30-11:00' },
    { value: 7, label: '13:30-14:00' },
    { value: 8, label: '14:00-14:30' },
    { value: 9, label: '14:30-15:00' },
    { value: 10, label: '15:00-15:30' },
    { value: 11, label: '15:30-16:00' },
    { value: 12, label: '16:00-16:30' },
  ];

  // 当前周的起始日期
  const currentWeekStart = ref<Dayjs>(dayjs().startOf('isoWeek'));

  // 排班数据
  const schedules = ref<ScheduleListDTO[]>([]);

  // 弹窗相关
  const modalVisible = ref(false);
  const currentScheduleId = ref<number>();
  const currentScheduleDate = ref<string>('');
  const currentSlotPeriod = ref<number>(1);

  // 复制排班弹窗
  const copyModalVisible = ref(false);

  // 导入排班弹窗
  const importModalVisible = ref(false);

  // 计算当前周的日期
  const weekDays = computed(() => {
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const date = currentWeekStart.value.add(i, 'day');
      days.push({
        date: date.format('YYYY-MM-DD'),
        name: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      });
    }
    return days;
  });

  // 周标签
  const weekLabel = computed(() => {
    const start = currentWeekStart.value.format('YYYY-MM-DD');
    const end = currentWeekStart.value.add(6, 'day').format('YYYY-MM-DD');
    return `${start} ~ ${end}`;
  });

  // 获取某个日期和时段的排班
  const getSchedule = (
    date: string,
    period: number
  ): ScheduleListDTO | undefined => {
    return schedules.value.find(
      (s) => s.scheduleDate === date && s.slotPeriod === period
    );
  };

  // 获取排班样式类
  const getScheduleClass = (schedule: ScheduleListDTO | undefined) => {
    if (!schedule) return '';
    return {
      'schedule-type-1': schedule.slotType === 1,
      'schedule-type-2': schedule.slotType === 2,
      'schedule-type-3': schedule.slotType === 3,
      'schedule-inactive': schedule.status === 0,
    };
  };

  // 获取排班类型标签
  const getSlotTypeLabel = (type: number) => {
    const typeMap: Record<number, string> = {
      1: t('schedulePage.slotType.normal'),
      2: t('schedulePage.slotType.expert'),
      3: t('schedulePage.slotType.special'),
    };
    return typeMap[type] || '';
  };

  // 格式化日期
  const formatDate = (date: string) => {
    return dayjs(date).format('MM-DD');
  };

  // 判断是否是今天
  const isToday = (date: string) => {
    return date === dayjs().format('YYYY-MM-DD');
  };

  // 获取排班数据
  const fetchSchedules = async () => {
    if (!props.selectedDoctorId) return;

    setLoading(true);
    try {
      const startDate = currentWeekStart.value.format('YYYY-MM-DD');
      const endDate = currentWeekStart.value.add(6, 'day').format('YYYY-MM-DD');

      const { data } = await getAllSchedules({
        doctorUserId: props.selectedDoctorId,
        scheduleStartDate: startDate,
        scheduleEndDate: endDate,
        pageNum: 1,
        pageSize: 1000,
      });

      schedules.value = data.list;
    } catch (err) {
      Message.error(t('schedulePage.message.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // 上一周
  const prevWeek = () => {
    currentWeekStart.value = currentWeekStart.value.subtract(1, 'week');
    fetchSchedules();
  };

  // 下一周
  const nextWeek = () => {
    currentWeekStart.value = currentWeekStart.value.add(1, 'week');
    fetchSchedules();
  };

  // 回到本周
  const goToThisWeek = () => {
    currentWeekStart.value = dayjs().startOf('isoWeek');
    fetchSchedules();
  };

  // 编辑排班
  const handleEdit = (schedule: ScheduleListDTO) => {
    currentScheduleId.value = schedule.scheduleId;
    currentScheduleDate.value = schedule.scheduleDate;
    currentSlotPeriod.value = schedule.slotPeriod;
    modalVisible.value = true;
  };

  // 点击单元格
  const handleCellClick = (date: string, period: number) => {
    const schedule = getSchedule(date, period);
    if (schedule) {
      handleEdit(schedule);
    } else {
      // 新增排班
      currentScheduleId.value = undefined;
      currentScheduleDate.value = date;
      currentSlotPeriod.value = period;
      modalVisible.value = true;
    }
  };

  // 删除排班
  const handleDelete = (schedule: ScheduleListDTO) => {
    Modal.confirm({
      title: t('schedulePage.message.deleteConfirm'),
      content: t('schedulePage.message.deleteConfirmContent'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteSchedule(schedule.scheduleId);
          Message.success(t('schedulePage.message.deleteSuccess'));
          fetchSchedules();
        } catch (err) {
          Message.error(t('schedulePage.message.deleteError'));
        }
      },
    });
  };

  // 弹窗取消
  const handleModalCancel = () => {
    modalVisible.value = false;
  };

  // 弹窗成功
  const handleModalSuccess = () => {
    modalVisible.value = false;
    fetchSchedules();
  };

  // 复制排班
  const handleCopySchedule = () => {
    copyModalVisible.value = true;
  };

  // 复制弹窗取消
  const handleCopyModalCancel = () => {
    copyModalVisible.value = false;
  };

  // 复制弹窗成功
  const handleCopyModalSuccess = () => {
    copyModalVisible.value = false;
    fetchSchedules();
  };

  // 导入排班
  const handleImportSchedule = () => {
    importModalVisible.value = true;
  };

  // 导入弹窗取消
  const handleImportModalCancel = () => {
    importModalVisible.value = false;
  };

  // 导入弹窗成功
  const handleImportModalSuccess = () => {
    importModalVisible.value = false;
    fetchSchedules();
  };

  // 监听选中的医生变化
  watch(
    () => props.selectedDoctorId,
    (newVal) => {
      if (newVal) {
        fetchSchedules();
      } else {
        schedules.value = [];
      }
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .schedule-calendar {
    min-height: calc(100vh - 180px);

    :deep(.arco-card-body) {
      overflow-x: auto;
      max-height: calc(100vh - 250px);
      overflow-y: auto;
    }
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .doctor-info {
      .doctor-label {
        color: var(--color-text-2);
        margin-right: 8px;
      }

      .doctor-name {
        font-weight: 600;
        color: var(--color-text-1);
      }
    }

    .week-label {
      font-weight: 500;
      color: var(--color-text-1);
    }
  }

  .calendar-grid {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border-2);
    border-radius: 4px;
    overflow: hidden;
  }

  .calendar-header-row,
  .calendar-row {
    display: flex;
  }

  .calendar-header-row {
    background-color: var(--color-fill-2);
  }

  .header-cell {
    font-weight: 600;
    text-align: center;
    padding: 12px 8px;
    border-bottom: 2px solid var(--color-border-2);
  }

  .time-cell {
    width: 100px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--color-border-2);
    background-color: var(--color-fill-1);

    .time-label {
      font-size: 12px;
      color: var(--color-text-2);
    }
  }

  .day-cell {
    flex: 1;
    border-right: 1px solid var(--color-border-2);

    &:last-child {
      border-right: none;
    }

    &.is-today {
      background-color: var(--color-primary-light-1);
      color: var(--color-primary-6);
    }

    .day-name {
      font-size: 14px;
      margin-bottom: 4px;
    }

    .day-date {
      font-size: 12px;
      color: var(--color-text-3);
    }
  }

  .calendar-row {
    border-bottom: 1px solid var(--color-border-2);

    &:last-child {
      border-bottom: none;
    }
  }

  .schedule-cell {
    flex: 1;
    min-height: 100px;
    border-right: 1px solid var(--color-border-2);
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s;
    padding: 4px;

    &:hover {
      background-color: var(--color-fill-1);
    }

    &:last-child {
      border-right: none;
    }
  }

  .empty-cell {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-4);
    font-size: 20px;
  }

  .schedule-item {
    width: 100%;
    height: 100%;
    padding: 8px;
    position: relative;
    border-radius: 4px;

    &.schedule-type-1 {
      background-color: #e8f4ff;
      border-left: 3px solid #1890ff;
      color: #1d39c4;

      .schedule-type {
        color: #1d39c4;
      }

      .schedule-info {
        color: #1d39c4;
      }
    }

    &.schedule-type-2 {
      background-color: #e6f7e6;
      border-left: 3px solid #52c41a;
      color: #237804;

      .schedule-type {
        color: #237804;
      }

      .schedule-info {
        color: #237804;
      }
    }

    &.schedule-type-3 {
      background-color: #fff7e6;
      border-left: 3px solid #fa8c16;
      color: #ad4e00;

      .schedule-type {
        color: #ad4e00;
      }

      .schedule-info {
        color: #ad4e00;
      }
    }

    &.schedule-inactive {
      opacity: 0.5;
      background-color: var(--color-fill-2);
      border-left-color: var(--color-text-4);
    }

    .schedule-type {
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .schedule-info {
      font-size: 11px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .schedule-fee {
      font-size: 12px;
      font-weight: 600;
      color: #cf1322;
    }

    .schedule-actions {
      position: absolute;
      top: 4px;
      right: 4px;
      display: none;
      gap: 4px;
    }

    &:hover .schedule-actions {
      display: flex;
    }
  }
</style>
