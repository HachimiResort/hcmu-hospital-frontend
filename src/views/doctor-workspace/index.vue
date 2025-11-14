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

            <a-calendar
              v-model:panel-value="selectedDate"
              v-model:panel-mode="panelMode"
              :header-render="() => null"
              @panel-change="handlePanelChange"
              @select="handleDateSelect"
            >
              <template #cell="{ date }">
                <div class="calendar-cell">
                  <div class="date-number">{{ dayjs(date).date() }}</div>
                  <div
                    v-if="getScheduleByDate(date).length > 0"
                    class="schedule-info"
                  >
                    <a-space direction="vertical" :size="4" fill>
                      <a-tag
                        v-for="schedule in getScheduleByDate(date)"
                        :key="schedule.scheduleId"
                        :color="getPeriodColor(schedule.slotPeriod)"
                        size="small"
                        class="schedule-tag"
                      >
                        <span class="tag-text">{{
                          getPeriodText(schedule.slotPeriod)
                        }}</span>
                        <span class="tag-slots"
                          >{{ schedule.availableSlots }}/{{
                            schedule.totalSlots
                          }}</span
                        >
                      </a-tag>
                    </a-space>
                  </div>
                </div>
              </template>
            </a-calendar>
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
      // 使用详情接口 GET /doctor-profiles/{userId}
      const response = await axios.get(`/doctor-profiles/${userStore.userId}`);

      if (response.data.code === 0 && response.data.data) {
        const { data } = response.data;
        doctorProfile.value = {
          doctorProfileId: data.doctorProfileId,
          userId: data.userId,
          userName: data.userName,
          name: data.name,
          departmentId: data.departmentId,
          departmentName: data.departmentName,
          title: data.title,
          specialty: data.specialty,
          bio: data.bio,
        };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('获取医生档案失败:', error);
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

      const response = await axios.get('/schedules', {
        params: {
          doctorUserId: userStore.userId,
          scheduleStartDate: start,
          scheduleEndDate: end,
          pageNum: 1,
          pageSize: 100,
        },
      });

      if (response.data.code === 0 && response.data.data) {
        schedules.value = response.data.data.list || [];
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('获取排班失败:', error);
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
    const map: Record<number, string> = {
      1: t('workspace.morning'),
      2: t('workspace.afternoon'),
      3: t('workspace.evening'),
    };
    return map[period] || '';
  };

  // 获取时段颜色
  const getPeriodColor = (period: number) => {
    const map: Record<number, string> = {
      1: 'orangered',
      2: 'blue',
      3: 'purple',
    };
    return map[period] || 'blue';
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
      // 调用医生更新自己的档案接口 PUT /doctor-profiles/self
      const updateData = {
        specialty: editForm.value.specialty,
        bio: editForm.value.bio,
      };

      const response = await axios.put('/doctor-profiles/self', updateData);

      if (response.data.code === 0) {
        Message.success(t('workspace.saveSuccess'));
        // 重新获取档案信息
        await fetchDoctorProfile();
        editModalVisible.value = false;
      } else {
        Message.error(response.data.msg || t('workspace.saveError'));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('保存医生档案失败:', error);
      Message.error(t('workspace.saveError'));
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
