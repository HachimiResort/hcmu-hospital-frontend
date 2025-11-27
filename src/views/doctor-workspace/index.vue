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
          <template #extra>
            <a-button type="primary" @click="handleApplyScheduleChange">
              <template #icon>
                <icon-edit />
              </template>
              {{ $t('workspace.applyScheduleChange') }}
            </a-button>
          </template>
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
            <div class="calendar-layout">
              <div class="custom-calendar">
                <!-- 星期标题 -->
                <div class="calendar-weekdays">
                  <div class="weekday">周一</div>
                  <div class="weekday">周二</div>
                  <div class="weekday">周三</div>
                  <div class="weekday">周四</div>
                  <div class="weekday">周五</div>
                  <div class="weekday">周六</div>
                  <div class="weekday">周日</div>
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
                      'selected': day.dateStr === selectedDate,
                    }"
                    @click="handleDateSelect(day.date)"
                  >
                    <div class="day-number">{{ day.day }}</div>
                    <div v-if="day.isCurrentMonth" class="day-schedules">
                      <div
                        v-for="schedule in getScheduleByDate(day.date)"
                        :key="schedule.scheduleId"
                        class="schedule-item"
                        :class="[
                          `schedule-type-${schedule.slotType}`,
                          { 'schedule-disabled': schedule.status === 0 },
                        ]"
                        @click.stop="handleScheduleClick(schedule)"
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

              <div class="schedule-side-panel">
                <div class="side-header">
                  <div class="side-date">
                    {{ dayjs(selectedDate).format('YYYY年MM月DD日') }}
                  </div>
                  <div class="side-count">
                    {{ selectedDateSchedules.length }} 条排班
                  </div>
                </div>
                <a-empty
                  v-if="selectedDateSchedules.length === 0"
                  :description="$t('workspace.noSchedule') || '暂无排班'"
                />
                <div v-else class="side-list">
                  <div
                    v-for="schedule in selectedDateSchedules"
                    :key="schedule.scheduleId"
                    class="side-item"
                    :class="[
                      `schedule-type-${schedule.slotType}`,
                      { 'schedule-disabled': schedule.status === 0 },
                    ]"
                    @click="handleScheduleClick(schedule)"
                  >
                    <div class="side-time">
                      {{ getPeriodText(schedule.slotPeriod) }}
                    </div>
                    <div class="side-meta">
                      <span class="side-availability"
                        >{{ schedule.availableSlots }}/{{
                          schedule.totalSlots
                        }}</span
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

    <!-- 申请修改排班 -->
    <a-modal
      v-model:visible="requestModalVisible"
      :title="$t('workspace.request.title')"
      :ok-loading="requestSubmitting"
      width="720px"
      @ok="handleSubmitScheduleRequest"
      @cancel="resetRequestForm()"
    >
      <a-form :model="requestForm" layout="vertical">
        <a-form-item :label="$t('workspace.request.schedule')" required>
          <a-select
            v-model="selectedScheduleId"
            :options="scheduleOptions"
            :placeholder="$t('workspace.request.schedulePlaceholder')"
            allow-clear
            @change="handleRequestScheduleChange"
          />
        </a-form-item>

        <a-form-item :label="$t('workspace.request.type')" required>
          <a-radio-group v-model="requestForm.requestType" type="button">
            <a-radio
              v-for="item in requestTypeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-row v-if="requestForm.requestType === 1" :gutter="16">
          <a-col :span="12">
            <a-form-item
              :label="$t('workspace.request.targetDate')"
              :required="requestForm.requestType === 1"
            >
              <a-date-picker
                v-model="requestForm.targetDate"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :disabled-date="
                  (current) =>
                    current
                      ? current.valueOf() < dayjs().startOf('day').valueOf()
                      : false
                "
                :placeholder="$t('workspace.request.targetDatePlaceholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              :label="$t('workspace.request.targetSlot')"
              :required="requestForm.requestType === 1"
            >
              <a-space direction="vertical" style="width: 100%">
                <a-select
                  v-model="requestForm.targetSlotPeriod"
                  :placeholder="$t('workspace.request.targetPeriodPlaceholder')"
                  allow-clear
                >
                  <a-option
                    v-for="period in Object.keys(slotPeriodMap)"
                    :key="period"
                    :value="Number(period)"
                    >{{ getPeriodText(Number(period)) }}</a-option
                  >
                </a-select>
                <a-select
                  v-model="requestForm.targetSlotType"
                  :placeholder="
                    $t('workspace.request.targetSlotTypePlaceholder')
                  "
                  allow-clear
                >
                  <a-option
                    v-for="item in slotTypeOptions"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</a-option
                  >
                </a-select>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          v-if="requestForm.requestType === 1 || requestForm.requestType === 3"
          :label="$t('workspace.request.extraSlots')"
          :required="requestForm.requestType === 3"
        >
          <a-input-number
            v-model="requestForm.extraSlots"
            :min="1"
            :placeholder="$t('workspace.request.extraSlotsPlaceholder')"
            style="width: 200px"
          />
        </a-form-item>

        <a-form-item :label="$t('workspace.request.reason')">
          <a-textarea
            v-model="requestForm.reason"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            :max-length="500"
            show-word-limit
            :placeholder="$t('workspace.request.reasonPlaceholder')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import {
    DoctorProfileDetailDTO,
    DoctorScheduleDTO,
    getDoctorProfileByUserId,
    getDoctorSchedules,
    updateDoctorProfileSelf,
  } from '@/api/doctor-profile';
  import {
    createScheduleRequest,
    ScheduleRequestCreateDTO,
  } from '@/api/schedule-request';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const router = useRouter();
  const userStore = useUserStore();

  const profileLoading = ref(false);
  const scheduleLoading = ref(false);
  const saveLoading = ref(false);
  const editModalVisible = ref(false);
  const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
  const panelMode = ref<'month' | 'year'>('month');
  const requestModalVisible = ref(false);
  const requestSubmitting = ref(false);
  const requestForm = ref<ScheduleRequestCreateDTO>({
    doctorUserId: 0,
    scheduleId: 0,
    requestType: 1,
    targetDate: '',
    targetSlotPeriod: undefined,
    targetSlotType: undefined,
    extraSlots: undefined,
    reason: '',
  });
  const selectedScheduleId = ref<number | undefined>(undefined);

  // 计算当前月份标题
  const currentMonthTitle = computed(() => {
    return dayjs(selectedDate.value).format('YYYY年MM月');
  });

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

  const slotTypeOptions = computed(() => [
    { value: 1, label: t('schedulePage.slotType.normal') },
    { value: 2, label: t('schedulePage.slotType.expert') },
    { value: 3, label: t('schedulePage.slotType.special') },
  ]);

  const requestTypeOptions = computed(() => [
    { value: 1, label: t('workspace.request.type.shiftChange') },
    { value: 2, label: t('workspace.request.type.leave') },
    { value: 3, label: t('workspace.request.type.extraSlot') },
  ]);

  const scheduleOptions = computed(() =>
    selectedDateSchedules.value.map((item) => ({
      value: item.scheduleId,
      label: `${dayjs(item.scheduleDate).format('MM-DD')} ${getPeriodText(
        item.slotPeriod
      )} · ${getSlotTypeText(item.slotType)}`,
    }))
  );

  // 生成月历数据
  const calendarDays = computed(() => {
    const currentMonth = dayjs(selectedDate.value);
    const firstDay = currentMonth.startOf('month');

    // 获取第一天是星期几 (0=周一)
    const firstDayOfWeek = (firstDay.day() + 6) % 7;

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

  const doctorProfile = ref<Partial<DoctorProfileDetailDTO>>({});
  const schedules = ref<DoctorScheduleDTO[]>([]);
  const editForm = ref<Partial<DoctorProfileDetailDTO>>({});

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

      const { data } = await getDoctorProfileByUserId(userStore.userId);

      // eslint-disable-next-line no-console
      console.log('医生档案接口返回:', data);

      if (data && (data as any).doctorProfileId) {
        doctorProfile.value = data;
        // eslint-disable-next-line no-console
        console.log('医生档案设置成功:', doctorProfile.value);
      } else {
        // eslint-disable-next-line no-console
        console.error('获取医生档案失败,数据格式不正确:', data);
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

      const { data } = await getDoctorSchedules(userStore.userId, {
        scheduleStartDate: start,
        scheduleEndDate: end,
        pageNum: 1,
        pageSize: 100,
      });

      // eslint-disable-next-line no-console
      console.log('排班接口返回:', data);

      const list = (data && (data as any).list) || [];
      schedules.value = list;
      // eslint-disable-next-line no-console
      console.log('排班数据设置成功,共', schedules.value.length, '条记录');
      // eslint-disable-next-line no-console
      console.log(
        '排班日期列表:',
        schedules.value.map((s) => s.scheduleDate)
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('获取排班失败:', error);
      Message.error('获取排班信息失败');
    } finally {
      scheduleLoading.value = false;
    }
  };

  // 根据日期获取排班
  const getScheduleByDate = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    return schedules.value.filter((s) => s.scheduleDate === dateStr);
  };

  const selectedDateSchedules = computed(() =>
    schedules.value.filter((s) => s.scheduleDate === selectedDate.value)
  );

  const selectedSchedule = computed(() =>
    schedules.value.find((s) => s.scheduleId === selectedScheduleId.value)
  );

  watch(selectedSchedule, (value) => {
    if (value) {
      requestForm.value.scheduleId = value.scheduleId;
      requestForm.value.targetDate = value.scheduleDate;
      requestForm.value.targetSlotPeriod = value.slotPeriod;
      requestForm.value.targetSlotType = value.slotType;
    }
  });

  // 获取时段文本
  const getPeriodText = (period: number) => {
    return slotPeriodMap[period] || `时段${period}`;
  };

  const getSlotTypeText = (slotType?: number) => {
    const found = slotTypeOptions.value.find((item) => item.value === slotType);
    return found?.label || `#${slotType}`;
  };

  // 处理日期选择
  const handleDateSelect = (date: Date) => {
    selectedDate.value = dayjs(date).format('YYYY-MM-DD');
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

      await updateDoctorProfileSelf(updateData);
      Message.success(t('workspace.saveSuccess'));

      // 直接更新本地数据，界面会立即更新
      doctorProfile.value.specialty = editForm.value.specialty;
      doctorProfile.value.bio = editForm.value.bio;

      editModalVisible.value = false;
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

  // 点击排班时段
  const handleScheduleClick = (schedule: DoctorScheduleDTO) => {
    if (schedule.status === 0) return;
    router.push({
      name: 'SchedulePatients',
      params: {
        scheduleId: schedule.scheduleId,
        userId: userStore.userId,
      },
    });
  };

  // 申请修改排班(暂时只是个按钮，下次实现功能)
  const handleApplyScheduleChange = () => {
    if (selectedDateSchedules.value.length === 0) {
      Message.warning(t('workspace.request.noScheduleForDate'));
      return;
    }
    const defaultSchedule = selectedDateSchedules.value[0];
    selectedScheduleId.value = defaultSchedule.scheduleId;
    resetRequestForm(defaultSchedule);
    requestModalVisible.value = true;
  };

  const resetRequestForm = (schedule?: DoctorScheduleDTO) => {
    const baseSchedule = schedule || selectedSchedule.value;
    requestForm.value = {
      doctorUserId: userStore.userId,
      scheduleId: baseSchedule?.scheduleId || 0,
      requestType: 1,
      targetDate: baseSchedule?.scheduleDate || selectedDate.value,
      targetSlotPeriod: baseSchedule?.slotPeriod,
      targetSlotType: baseSchedule?.slotType,
      extraSlots: undefined,
      reason: '',
    };
  };

  const handleRequestScheduleChange = (
    value:
      | string
      | number
      | boolean
      | Record<string, any>
      | (string | number | boolean | Record<string, any>)[]
      | undefined
  ) => {
    const parsed =
      typeof value === 'string' ? Number.parseInt(value, 10) : value;
    const id =
      typeof parsed === 'number' && !Number.isNaN(parsed) ? parsed : undefined;
    selectedScheduleId.value = id;
    if (typeof selectedScheduleId.value === 'number') {
      const match = schedules.value.find(
        (s) => s.scheduleId === selectedScheduleId.value
      );
      if (match) {
        resetRequestForm(match);
      }
    }
  };

  const validateRequestForm = () => {
    if (!requestForm.value.scheduleId) {
      Message.error(t('workspace.request.validate.schedule'));
      return false;
    }
    if (requestForm.value.requestType === 1) {
      if (!requestForm.value.targetDate) {
        Message.error(t('workspace.request.validate.targetDate'));
        return false;
      }
      if (
        !requestForm.value.targetSlotPeriod ||
        !requestForm.value.targetSlotType
      ) {
        Message.error(t('workspace.request.validate.targetSlot'));
        return false;
      }
    }
    if (requestForm.value.requestType === 2) {
      if (!requestForm.value.reason) {
        Message.error(t('workspace.request.validate.reason'));
        return false;
      }
    }
    if (requestForm.value.requestType === 3) {
      if (!requestForm.value.extraSlots || requestForm.value.extraSlots < 1) {
        Message.error(t('workspace.request.validate.extraSlots'));
        return false;
      }
    }
    return true;
  };

  const handleSubmitScheduleRequest = async () => {
    if (!validateRequestForm()) return;
    try {
      requestSubmitting.value = true;
      const payload: ScheduleRequestCreateDTO = {
        ...requestForm.value,
        doctorUserId: userStore.userId,
        targetDate: requestForm.value.targetDate
          ? dayjs(requestForm.value.targetDate).format('YYYY-MM-DD')
          : undefined,
      };
      await createScheduleRequest(payload);
      Message.success(t('workspace.request.submitSuccess'));
      requestModalVisible.value = false;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('创建排班申请失败:', error);
      Message.error(
        error?.response?.data?.msg || t('workspace.request.submitError')
      );
    } finally {
      requestSubmitting.value = false;
    }
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
      .calendar-layout {
        display: flex;
        gap: 16px;
        align-items: flex-start;
        flex-wrap: wrap;
        overflow-x: auto;
      }

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
        overflow: auto;
        flex: 1 1 640px;
        min-width: 640px;
        max-width: 100%;
        height: 768px;

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, minmax(90px, 1fr));
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

            &.selected {
              box-shadow: inset 0 0 0 2px rgb(var(--primary-6));
            }
          }
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, minmax(90px, 1fr));
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
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;

                &:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

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

                &.schedule-disabled {
                  cursor: not-allowed;
                  opacity: 0.6;
                  pointer-events: none;
                  box-shadow: none;
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

      .schedule-side-panel {
        width: 320px;
        min-height: 768px;
        border: 1px solid var(--color-border-2);
        border-radius: 8px;
        padding: 16px;
        background-color: var(--color-bg-2);
        display: flex;
        flex-direction: column;
        gap: 12px;

        .side-header {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .side-date {
            font-size: 16px;
            font-weight: 600;
            color: var(--color-text-1);
          }

          .side-count {
            font-size: 13px;
            color: var(--color-text-3);
          }
        }

        .side-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .side-item {
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid var(--color-border-2);
          transition: box-shadow 0.2s, transform 0.2s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          }

          .side-time {
            font-weight: 700;
            margin-bottom: 6px;
          }

          .side-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--color-text-3);
            font-size: 13px;

            .side-availability {
              font-weight: 600;
              color: var(--color-text-1);
            }
          }

          &.schedule-type-1 {
            background-color: rgb(var(--blue-1));
            border-color: rgb(var(--blue-3));
            color: rgb(var(--blue-7));
          }

          &.schedule-type-2 {
            background-color: rgb(var(--green-1));
            border-color: rgb(var(--green-3));
            color: rgb(var(--green-7));
          }

          &.schedule-type-3 {
            background-color: rgb(var(--orange-1));
            border-color: rgb(var(--orange-3));
            color: rgb(var(--orange-7));
          }

          &.schedule-disabled {
            cursor: not-allowed;
            opacity: 0.6;
            pointer-events: none;
            box-shadow: none;
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

    @media (max-width: 992px) {
      .calendar-card {
        .custom-calendar {
          min-width: 100%;
          height: auto;
        }

        .calendar-weekdays {
          grid-template-columns: repeat(7, minmax(64px, 1fr));
        }

        .calendar-days {
          grid-template-columns: repeat(7, minmax(64px, 1fr));
          grid-template-rows: repeat(6, minmax(80px, 1fr));
        }

        .schedule-side-panel {
          width: 100%;
          min-height: auto;
        }
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
