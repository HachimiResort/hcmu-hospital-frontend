<template>
  <div class="doctor-workspace">
    <a-row :gutter="20">
      <!-- 排班日历 -->
      <a-col :xs="24" :lg="18">
        <a-card
          :title="$t('workspace.scheduleCalendar')"
          :bordered="false"
          class="calendar-card"
        >
          <a-spin :loading="scheduleLoading">
            <!-- 自定义日历头部 -->
            <div class="calendar-header-custom">
              <a-button type="outline" size="medium" @click="handlePrevMonth">
                <template #icon>
                  <icon-left />
                </template>
              </a-button>
              <span class="calendar-month-title">{{ currentMonthTitle }}</span>
              <a-button type="outline" size="medium" @click="handleNextMonth">
                <template #icon>
                  <icon-right />
                </template>
              </a-button>
              <a-button type="primary" size="medium" @click="handleToday">
                {{ $t('workspace.today') }}
              </a-button>
            </div>

            <!-- 自定义月历布局 -->
            <div class="custom-calendar">
              <!-- 星期标题 -->
              <div class="calendar-weekdays">
                <div class="weekday">周日</div>
                <div class="weekday">周一</div>
                <div class="weekday">周二</div>
                <div class="weekday">周三</div>
                <div class="weekday">周四</div>
                <div class="weekday">周五</div>
                <div class="weekday">周六</div>
              </div>

              <!-- 日期网格 -->
              <div class="calendar-days">
                <div
                  v-for="day in calendarDays"
                  :key="day.dateStr"
                  class="calendar-day"
                  :class="{
                    'other-month': !day.isCurrentMonth,
                    'today': day.isToday,
                  }"
                  @click="handleDateSelect(day.date)"
                >
                  <div class="day-number">{{ day.day }}</div>
                  <div v-if="day.isCurrentMonth" class="day-schedules">
                    <div
                      v-for="schedule in getScheduleByDate(day.date)"
                      :key="schedule.scheduleId"
                      class="schedule-item"
                      :class="`schedule-type-${schedule.slotType}`"
                    >
                      <div class="schedule-time">{{
                        getPeriodText(schedule.slotPeriod)
                      }}</div>
                      <div class="schedule-count"
                        >{{ schedule.availableSlots }}/{{
                          schedule.totalSlots
                        }}</div
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-spin>
        </a-card>
      </a-col>

      <!-- 医生档案信息 -->
      <a-col :xs="24" :lg="6">
        <a-card
          :title="$t('workspace.doctorProfile')"
          :bordered="false"
          class="profile-card"
        >
          <a-spin :loading="profileLoading">
            <div class="profile-header">
              <a-avatar :size="70" class="profile-avatar">
                <icon-user />
              </a-avatar>
              <div class="profile-name-section">
                <h3 class="profile-name">{{ doctorProfile.name || '-' }}</h3>
                <p class="profile-username"
                  >@{{ doctorProfile.userName || '-' }}</p
                >
              </div>
            </div>

            <a-divider />

            <div class="profile-info-section">
              <div class="info-item">
                <span class="info-label">
                  <icon-apps />
                  {{ $t('workspace.department') }}
                </span>
                <span class="info-value">{{
                  doctorProfile.departmentName || '-'
                }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">
                  <icon-idcard />
                  {{ $t('workspace.title') }}
                </span>
                <span class="info-value">{{ doctorProfile.title || '-' }}</span>
              </div>

              <div class="info-item">
                <span class="info-label">
                  <icon-star />
                  {{ $t('workspace.specialty') }}
                </span>
                <span class="info-value">{{
                  doctorProfile.specialty || '-'
                }}</span>
              </div>

              <div v-if="doctorProfile.bio" class="info-item bio-item">
                <span class="info-label">
                  <icon-file-text />
                  {{ $t('workspace.bio') }}
                </span>
                <p class="info-value bio-text">{{ doctorProfile.bio }}</p>
              </div>
            </div>

            <div class="profile-actions">
              <a-button type="primary" long @click="handleEditProfile">
                <template #icon>
                  <icon-edit />
                </template>
                {{ $t('workspace.editProfile') }}
              </a-button>
            </div>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>

    <!-- 编辑医生档案模态框 -->
    <a-modal
      v-model:visible="editModalVisible"
      :title="$t('workspace.editProfile')"
      :ok-loading="saveLoading"
      width="600px"
      @ok="handleSaveProfile"
      @cancel="handleCancelEdit"
    >
      <a-form :model="editForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="$t('workspace.name')">
              <a-input v-model="editForm.name" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="$t('workspace.userName')">
              <a-input v-model="editForm.userName" disabled />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item :label="$t('workspace.department')">
          <a-input v-model="editForm.departmentName" disabled>
            <template #suffix>
              <a-tooltip :content="$t('workspace.departmentNotEditable')">
                <icon-info-circle style="color: var(--color-text-3)" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item :label="$t('workspace.title')">
          <a-input v-model="editForm.title" disabled>
            <template #suffix>
              <a-tooltip :content="$t('workspace.titleNotEditable')">
                <icon-info-circle style="color: var(--color-text-3)" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item :label="$t('workspace.specialty')">
          <a-input
            v-model="editForm.specialty"
            :placeholder="$t('workspace.specialtyPlaceholder')"
            allow-clear
          />
        </a-form-item>

        <a-form-item :label="$t('workspace.bio')">
          <a-textarea
            v-model="editForm.bio"
            :rows="5"
            :placeholder="$t('workspace.bioPlaceholder')"
            allow-clear
            show-word-limit
            :max-length="500"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import axios from 'axios';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const userStore = useUserStore();

  const profileLoading = ref(false);
  const scheduleLoading = ref(false);
  const saveLoading = ref(false);
  const editModalVisible = ref(false);
  const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
  const panelMode = ref<'month' | 'year'>('month');

  // 计算当前月份标题
  const currentMonthTitle = computed(() => {
    return dayjs(selectedDate.value).format('YYYY年MM月');
  });

  // 生成月历数据
  const calendarDays = computed(() => {
    const currentMonth = dayjs(selectedDate.value);
    const firstDay = currentMonth.startOf('month');
    const lastDay = currentMonth.endOf('month');

    // 获取第一天是星期几 (0=周日)
    const firstDayOfWeek = firstDay.day();

    // 获取上个月需要显示的天数
    const prevMonthDays = firstDayOfWeek;
    const prevMonthStart = firstDay.subtract(prevMonthDays, 'day');

    // 计算需要显示的总天数 (通常是 35 或 42 天)
    const totalDays = 42;

    const days = [];
    const today = dayjs();

    for (let i = 0; i < totalDays; i += 1) {
      const date = prevMonthStart.add(i, 'day');
      days.push({
        date: date.toDate(),
        dateStr: date.format('YYYY-MM-DD'),
        day: date.date(),
        isCurrentMonth: date.month() === currentMonth.month(),
        isToday: date.isSame(today, 'day'),
      });
    }

    return days;
  });

  interface DoctorProfile {
    doctorProfileId?: number;
    userId?: number;
    userName?: string;
    name?: string;
    departmentId?: number;
    departmentName?: string;
    title?: string;
    specialty?: string;
    bio?: string;
  }

  interface Schedule {
    scheduleId: number;
    scheduleDate: string;
    slotPeriod: number;
    totalSlots: number;
    availableSlots: number;
    status: number;
  }

  const doctorProfile = ref<DoctorProfile>({});
  const schedules = ref<Schedule[]>([]);
  const editForm = ref<DoctorProfile>({});

  // 强制保持月视图
  watch(panelMode, (newMode) => {
    if (newMode === 'year') {
      panelMode.value = 'month';
    }
  });

  // 获取医生档案详情
  const fetchDoctorProfile = async () => {
    try {
      profileLoading.value = true;
      // eslint-disable-next-line no-console
      console.log('开始获取医生档案, userId:', userStore.userId);

      // 使用详情接口 GET /doctor-profiles/{userId}
      // 此接口需要 CHECK_DOCTOR 权限
      const response = await axios.get(`/doctor-profiles/${userStore.userId}`);

      // eslint-disable-next-line no-console
      console.log('医生档案接口返回:', response.data);

      // 后端直接返回数据对象,没有包装在 { code, msg, data } 中
      if (response.data && response.data.doctorProfileId) {
        const {
          doctorProfileId,
          userId,
          userName,
          name,
          departmentId,
          departmentName,
          title,
          specialty,
          bio,
        } = response.data;
        doctorProfile.value = {
          doctorProfileId,
          userId,
          userName,
          name,
          departmentId,
          departmentName,
          title,
          specialty,
          bio,
        };
        // eslint-disable-next-line no-console
        console.log('医生档案设置成功:', doctorProfile.value);
      } else {
        // eslint-disable-next-line no-console
        console.error('获取医生档案失败,数据格式不正确:', response.data);
        Message.error('获取医生档案失败,请检查权限配置');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('获取医生档案失败:', error);
      Message.error('获取医生档案失败,请检查是否有CHECK_DOCTOR权限');
    } finally {
      profileLoading.value = false;
    }
  };

  // 获取排班数据
  const fetchSchedules = async (startDate?: string, endDate?: string) => {
    try {
      scheduleLoading.value = true;
      const start = startDate || dayjs().startOf('month').format('YYYY-MM-DD');
      const end = endDate || dayjs().endOf('month').format('YYYY-MM-DD');

      // 使用排班接口 GET /schedules
      // 此接口可能需要 CHECK_SCHEDULE 权限
      const response = await axios.get('/schedules', {
        params: {
          doctorUserId: userStore.userId,
          scheduleStartDate: start,
          scheduleEndDate: end,
          pageNum: 1,
          pageSize: 100,
        },
      });

      // eslint-disable-next-line no-console
      console.log('排班接口返回:', response.data);

      // 后端直接返回 { list: [...], total: ... },没有包装在 { code, msg, data } 中
      if (response.data && response.data.list) {
        schedules.value = response.data.list || [];
        // eslint-disable-next-line no-console
        console.log('排班数据设置成功,共', schedules.value.length, '条记录');
        // eslint-disable-next-line no-console
        console.log(
          '排班日期列表:',
          schedules.value.map((s) => s.scheduleDate)
        );
      } else {
        // eslint-disable-next-line no-console
        console.error('获取排班失败,数据格式不正确:', response.data);
        Message.error('获取排班信息失败,请检查权限配置');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('获取排班失败:', error);
      Message.error('获取排班信息失败,请检查是否有CHECK_SCHEDULE权限');
    } finally {
      scheduleLoading.value = false;
    }
  };

  // 根据日期获取排班
  const getScheduleByDate = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    return schedules.value.filter((s) => s.scheduleDate === dateStr);
  };

  // 获取时段文本
  const getPeriodText = (period: number) => {
    const slotPeriodMap: Record<number, string> = {
      1: '上午8:00-8:30',
      2: '上午8:30-9:00',
      3: '上午9:00-9:30',
      4: '上午9:30-10:00',
      5: '上午10:00-10:30',
      6: '上午10:30-11:00',
      7: '下午13:30-14:00',
      8: '下午14:00-14:30',
      9: '下午14:30-15:00',
      10: '下午15:00-15:30',
      11: '下午15:30-16:00',
      12: '下午16:00-16:30',
    };
    return slotPeriodMap[period] || `时段${period}`;
  };

  // 获取时段颜色 (1-6上午用蓝色,7-12下午用橙色)
  const getPeriodColor = (period: number) => {
    return period <= 6 ? 'blue' : 'orange';
  };

  // 获取号类型颜色 (1=普通号蓝色, 2=专家号绿色, 3=特需号橙色)
  const getSlotTypeColor = (slotType: number) => {
    const colorMap: Record<number, string> = {
      1: 'blue', // 普通号
      2: 'green', // 专家号
      3: 'orange', // 特需号
    };
    return colorMap[slotType] || 'blue';
  };

  // 处理日期选择
  const handleDateSelect = (date: Date) => {
    selectedDate.value = dayjs(date).format('YYYY-MM-DD');
  };

  // 处理面板变化
  const handlePanelChange = (date: Date) => {
    const newDate = dayjs(date);
    const start = newDate.startOf('month').format('YYYY-MM-DD');
    const end = newDate.endOf('month').format('YYYY-MM-DD');
    fetchSchedules(start, end);
  };

  // 上一个月
  const handlePrevMonth = () => {
    const newDate = dayjs(selectedDate.value).subtract(1, 'month');
    selectedDate.value = newDate.format('YYYY-MM-DD');
    const start = newDate.startOf('month').format('YYYY-MM-DD');
    const end = newDate.endOf('month').format('YYYY-MM-DD');
    fetchSchedules(start, end);
  };

  // 下一个月
  const handleNextMonth = () => {
    const newDate = dayjs(selectedDate.value).add(1, 'month');
    selectedDate.value = newDate.format('YYYY-MM-DD');
    const start = newDate.startOf('month').format('YYYY-MM-DD');
    const end = newDate.endOf('month').format('YYYY-MM-DD');
    fetchSchedules(start, end);
  };

  // 回到今天
  const handleToday = () => {
    selectedDate.value = dayjs().format('YYYY-MM-DD');
    const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const end = dayjs().endOf('month').format('YYYY-MM-DD');
    fetchSchedules(start, end);
  };

  // 编辑档案
  const handleEditProfile = () => {
    editForm.value = { ...doctorProfile.value };
    editModalVisible.value = true;
  };

  // 保存档案
  const handleSaveProfile = async () => {
    try {
      saveLoading.value = true;
      // 使用 PUT /doctor-profiles/self 接口
      const updateData = {
        specialty: editForm.value.specialty,
        bio: editForm.value.bio,
      };

      // eslint-disable-next-line no-console
      console.log('准备保存档案, 数据:', updateData);

      const response = await axios.put('/doctor-profiles/self', updateData);

      // eslint-disable-next-line no-console
      console.log('保存档案接口返回(经过拦截器):', response);

      // axios拦截器已经处理了响应，response就是res (即原始的response.data)
      // 拦截器在res.code === 200时返回res，所以这里response就是HttpResponse类型
      const res = response as any;
      if (res.code === 200 || res.code === 0) {
        Message.success(t('workspace.saveSuccess'));

        // 直接更新本地数据，界面会立即更新
        doctorProfile.value.specialty = editForm.value.specialty;
        doctorProfile.value.bio = editForm.value.bio;

        editModalVisible.value = false;
      } else {
        Message.error(res.msg || t('workspace.saveError'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('保存医生档案失败:', error);
      Message.error(
        error?.response?.data?.msg || error?.message || t('workspace.saveError')
      );
    } finally {
      saveLoading.value = false;
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    editModalVisible.value = false;
  };

  // 初始化加载数据
  onMounted(() => {
    // 确保 userStore 已加载
    if (!userStore.userId) {
      const checkUser = setInterval(() => {
        if (userStore.userId) {
          clearInterval(checkUser);
          fetchDoctorProfile();
          fetchSchedules();
        }
      }, 100);
      setTimeout(() => clearInterval(checkUser), 3000);
    } else {
      fetchDoctorProfile();
      fetchSchedules();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'DoctorWorkspace',
  };
</script>

<style scoped lang="less">
  .doctor-workspace {
    padding: 20px;
    background-color: var(--color-fill-1);
    min-height: calc(100vh - 60px);

    :deep(.arco-card) {
      margin-bottom: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .arco-card-header {
        border-bottom: 1px solid var(--color-border-2);
        padding: 18px 20px;

        .arco-card-header-title {
          font-size: 17px;
          font-weight: 600;
        }
      }

      .arco-card-body {
        padding: 20px;
      }
    }

    // 排班日历样式
    .calendar-card {
      // 自定义日历头部
      .calendar-header-custom {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 18px 0;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--color-border-2);

        .calendar-month-title {
          font-size: 19px;
          font-weight: 600;
          color: var(--color-text-1);
          min-width: 150px;
          text-align: center;
          padding: 0 20px;
        }

        :deep(.arco-btn) {
          height: 36px;

          &.arco-btn-outline {
            width: 36px;
            padding: 0;
            border-color: var(--color-border-3);

            &:hover {
              border-color: rgb(var(--primary-6));
              color: rgb(var(--primary-6));
            }
          }

          &.arco-btn-primary {
            margin-left: 12px;
            padding: 0 20px;
          }

          .arco-icon {
            font-size: 16px;
          }
        }
      }

      // 自定义日历样式
      .custom-calendar {
        border: 1px solid var(--color-border-2);
        border-radius: 8px;
        overflow: hidden;
        width: 840px;
        height: 768px;

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 120px);
          background-color: var(--color-fill-2);
          border-bottom: 1px solid var(--color-border-2);
          height: 48px;

          .weekday {
            padding: 12px 8px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
            color: var(--color-text-2);
            border-right: 1px solid var(--color-border-2);

            &:last-child {
              border-right: none;
            }
          }
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 120px);
          grid-template-rows: repeat(6, 120px);
          background-color: var(--color-bg-2);

          .calendar-day {
            background-color: var(--color-bg-2);
            padding: 8px;
            cursor: pointer;
            transition: all 0.2s;
            border-right: 1px solid var(--color-border-2);
            border-bottom: 1px solid var(--color-border-2);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            &:nth-child(7n) {
              border-right: none;
            }

            &:nth-last-child(-n + 7) {
              border-bottom: none;
            }

            &:hover {
              background-color: var(--color-fill-2);
              z-index: 1;
            }

            &.other-month {
              background-color: var(--color-fill-1);
              opacity: 0.5;

              .day-number {
                color: var(--color-text-3);
              }
            }

            &.today {
              background-color: rgb(var(--primary-1));

              .day-number {
                background-color: rgb(var(--primary-6));
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                line-height: 24px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
              }
            }

            .day-number {
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 6px;
              color: var(--color-text-1);
              display: block;
              text-align: left;
              flex-shrink: 0;
            }

            .day-schedules {
              display: flex;
              flex-direction: column;
              gap: 4px;
              flex: 1;
              overflow-y: auto;
              overflow-x: hidden;

              &::-webkit-scrollbar {
                width: 4px;
              }

              &::-webkit-scrollbar-thumb {
                background-color: var(--color-border-3);
                border-radius: 2px;
              }

              .schedule-item {
                padding: 4px 6px;
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.3;
                flex-shrink: 0;

                &.schedule-type-1 {
                  background-color: rgb(var(--blue-1));
                  border: 1px solid rgb(var(--blue-3));
                  color: rgb(var(--blue-6));
                }

                &.schedule-type-2 {
                  background-color: rgb(var(--green-1));
                  border: 1px solid rgb(var(--green-3));
                  color: rgb(var(--green-6));
                }

                &.schedule-type-3 {
                  background-color: rgb(var(--orange-1));
                  border: 1px solid rgb(var(--orange-3));
                  color: rgb(var(--orange-6));
                }

                .schedule-time {
                  font-weight: 500;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .schedule-count {
                  font-weight: 700;
                  margin-top: 2px;
                }
              }
            }
          }
        }
      }

      :deep(.arco-calendar) {
        border-radius: 8px;
        width: 100%;

        // 隐藏默认头部
        .arco-calendar-header {
          display: none;
        }

        // 隐藏星期行的底部边框
        .arco-calendar-week-list {
          border-bottom: none;

          .arco-calendar-week-list-item {
            border-bottom: none;
          }
        }

        .arco-calendar-body {
          border: none;
          width: 100%;
        }

        table {
          width: 100%;
        }

        .arco-calendar-month {
          border-collapse: collapse;
          width: 100%;

          .arco-calendar-cell {
            height: 120px;
            min-height: 120px;
            border: 1px solid var(--color-border-2);
            transition: all 0.2s ease;
            position: relative;

            &:hover {
              background-color: var(--color-fill-2);
              transform: translateY(-2px);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
              z-index: 1;
            }
          }

          .arco-calendar-cell-selected {
            background-color: var(--color-primary-light-1);
            border-color: var(--color-primary-light-3);

            &:hover {
              background-color: var(--color-primary-light-2);
            }
          }

          .arco-calendar-cell-today {
            .date-number {
              color: rgb(var(--primary-6));
              font-weight: 600;
            }
          }
        }
      }

      .calendar-cell {
        position: relative;
        height: 100%;
        padding: 12px;

        .date-number {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-1);
          margin-bottom: 8px;
        }

        .schedule-info {
          .schedule-tag {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: 13px;
            padding: 6px 10px;
            border-radius: 4px;
            margin-bottom: 4px;

            .tag-text {
              font-weight: 500;
            }

            .tag-slots {
              font-size: 12px;
              opacity: 0.9;
              margin-left: 8px;
            }
          }
        }
      }
    }

    // 医生档案样式
    .profile-card {
      height: calc(100% - 20px);

      .profile-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 0 12px;

        .profile-avatar {
          background: linear-gradient(
            135deg,
            rgb(var(--primary-6)),
            rgb(var(--primary-5))
          );
          margin-bottom: 12px;
          font-size: 32px;
        }

        .profile-name-section {
          text-align: center;

          .profile-name {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-text-1);
            margin: 0 0 6px 0;
          }

          .profile-username {
            font-size: 13px;
            color: var(--color-text-3);
            margin: 0;
          }
        }
      }

      :deep(.arco-divider) {
        margin: 16px 0;
      }

      .profile-info-section {
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 14px;
          margin-bottom: 10px;
          background-color: var(--color-fill-2);
          border-radius: 6px;
          transition: all 0.2s ease;

          &:hover {
            background-color: var(--color-fill-3);
            transform: translateX(4px);
          }

          &.bio-item {
            .info-value {
              max-height: none;
            }
          }

          .info-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 500;
            color: var(--color-text-2);

            svg {
              font-size: 14px;
              color: rgb(var(--primary-6));
            }
          }

          .info-value {
            font-size: 13px;
            color: var(--color-text-1);
            padding-left: 20px;
            line-height: 1.5;

            &.bio-text {
              white-space: pre-wrap;
              word-break: break-word;
            }
          }
        }
      }

      .profile-actions {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--color-border-2);

        :deep(.arco-btn) {
          height: 36px;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    // 编辑模态框样式
    :deep(.arco-modal) {
      .arco-modal-header {
        border-bottom: 2px solid var(--color-border-2);
      }

      .arco-form-item-label-col {
        font-weight: 500;
      }

      .arco-input-disabled,
      .arco-textarea-disabled {
        background-color: var(--color-fill-2);
        cursor: not-allowed;
      }
    }

    // 响应式调整
    @media (max-width: 1200px) {
      .calendar-card {
        margin-bottom: 24px;
      }

      .profile-card {
        height: auto;
      }
    }

    @media (max-width: 768px) {
      padding: 16px;

      :deep(.arco-card) {
        margin-bottom: 16px;

        .arco-card-header {
          padding: 16px;
        }

        .arco-card-body {
          padding: 16px;
        }
      }

      .calendar-cell {
        padding: 6px;

        .date-number {
          font-size: 14px;
        }

        .schedule-info {
          .schedule-tag {
            font-size: 10px;
            padding: 2px 6px;
          }
        }
      }

      .profile-header {
        .profile-avatar {
          :deep(.arco-avatar) {
            width: 64px !important;
            height: 64px !important;
            font-size: 28px;
          }
        }

        .profile-name {
          font-size: 18px;
        }
      }
    }
  }
</style>
