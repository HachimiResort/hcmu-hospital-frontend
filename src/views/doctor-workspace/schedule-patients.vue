<template>
  <div class="schedule-patients-page">
    <a-row :gutter="20" class="content-row">
      <!-- 左侧患者列表 -->
      <a-col :span="8">
        <a-card :title="$t('schedulePatients.patientList')" :bordered="false">
          <div class="emergency-appoint">
            <a-select
              v-model="emergencySelectedPatientId"
              allow-search
              :filter-option="false"
              :loading="emergencySearchLoading"
              :placeholder="$t('schedulePatients.emergency.placeholder')"
              :options="[]"
              @search="handleSearchPatients"
            >
              <a-option
                v-for="option in emergencyPatientOptions"
                :key="option.userId"
                :value="option.userId"
              >
                <div class="patient-option">
                  <div class="patient-option__name">
                    {{ option.name || '-' }}
                    <span class="patient-option__username">
                      ({{ option.userName || '-' }})
                    </span>
                  </div>
                  <div class="patient-option__meta">
                    ID: {{ option.userId }} ·
                    {{ getIdentityTypeText(option.identityType) }}
                  </div>
                </div>
              </a-option>
            </a-select>
            <a-button
              type="primary"
              size="small"
              :loading="emergencyAppointLoading"
              :disabled="!emergencySelectedPatientId"
              @click="handleEmergencyAppoint"
            >
              {{ $t('schedulePatients.actions.emergencyAppoint') }}
            </a-button>
          </div>

          <!-- 状态图例 -->
          <div class="status-legend">
            <div class="legend-item">
              <span class="legend-dot status-unpaid"></span>
              <span class="legend-text">{{
                $t('schedulePatients.legend.unpaid')
              }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot status-paid"></span>
              <span class="legend-text">{{
                $t('schedulePatients.legend.paid')
              }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot status-called"></span>
              <span class="legend-text">{{
                $t('schedulePatients.legend.called')
              }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot status-completed"></span>
              <span class="legend-text">{{
                $t('schedulePatients.legend.completed')
              }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot status-noshow"></span>
              <span class="legend-text">{{
                $t('schedulePatients.legend.noshow')
              }}</span>
            </div>
          </div>
          <a-divider :margin="12" />
          <a-spin :loading="patientsLoading">
            <a-list :bordered="false">
              <a-list-item
                v-for="patient in patients"
                :key="patient.userId"
                class="patient-item"
                :class="{
                  'active': selectedPatientId === patient.userId,
                  'disabled': getPatientStatus(patient.userId) === 1,
                  [`status-${getStatusClass(patient.userId)}`]: true,
                  'checked-in': isCheckedIn(patient.userId),
                }"
                @click="handleSelectPatient(patient.userId)"
              >
                <div class="patient-info">
                  <div class="patient-name">
                    <span class="status-indicator"></span>
                    {{ patient.name }}
                    <a-tag
                      v-if="isCheckedIn(patient.userId)"
                      size="small"
                      color="green"
                      class="check-in-tag"
                    >
                      {{ $t('schedulePatients.checkedIn') }}
                    </a-tag>
                  </div>
                  <div class="patient-details">
                    <span>{{ patient.sex }}</span>
                    <a-divider direction="vertical" />
                    <span>{{ patient.phone }}</span>
                  </div>
                </div>
              </a-list-item>
              <a-empty v-if="patients.length === 0" />
            </a-list>
          </a-spin>
        </a-card>
      </a-col>

      <!-- 右侧患者详情 -->
      <a-col :span="16">
        <a-card :title="$t('schedulePatients.patientDetail')" :bordered="false">
          <a-spin :loading="detailLoading">
            <div v-if="selectedPatientId && patientDetail">
              <!-- 基本信息 -->
              <a-descriptions
                :column="2"
                :label-style="{ fontWeight: 600 }"
                style="margin-bottom: 24px"
              >
                <a-descriptions-item :label="$t('schedulePatients.userName')">
                  {{ patientDetail.userName }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('schedulePatients.name')">
                  {{ patientDetail.name }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('schedulePatients.identityType')"
                >
                  {{ getIdentityTypeText(patientDetail.identityType) }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('schedulePatients.studentTeacherId')"
                >
                  {{ patientDetail.studentTeacherId || '-' }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('schedulePatients.emergencyContact')"
                >
                  {{ patientDetail.emergencyContact || '-' }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('schedulePatients.emergencyContactPhone')"
                >
                  {{ patientDetail.emergencyContactPhone || '-' }}
                </a-descriptions-item>
              </a-descriptions>

              <!-- 医疗信息 -->
              <a-divider />
              <a-descriptions
                :column="1"
                :label-style="{ fontWeight: 600 }"
                style="margin-bottom: 24px"
              >
                <a-descriptions-item
                  :label="$t('schedulePatients.medicalHistory')"
                >
                  {{ patientDetail.medicalHistory || '-' }}
                </a-descriptions-item>
                <a-descriptions-item
                  :label="$t('schedulePatients.allergyHistory')"
                >
                  {{ patientDetail.allergyHistory || '-' }}
                </a-descriptions-item>
              </a-descriptions>

              <!-- 预约状态和操作按钮 -->
              <a-divider />
              <div class="appointment-actions">
                <!-- Status 1: 未支付 -->
                <a-alert
                  v-if="appointmentStatus === 1"
                  type="warning"
                  show-icon
                >
                  {{ $t('schedulePatients.status.unpaid') }}
                </a-alert>

                <!-- Status 2: 已支付,显示传呼按钮 -->
                <a-space
                  v-else-if="appointmentStatus === 2"
                  direction="vertical"
                  size="medium"
                >
                  <a-alert type="success" show-icon>
                    {{ $t('schedulePatients.status.paid') }}
                  </a-alert>
                  <a-button
                    type="primary"
                    :loading="callLoading"
                    @click="handleCall"
                  >
                    {{ $t('schedulePatients.actions.call') }}
                  </a-button>
                </a-space>

                <!-- Status 3: 已传呼,显示完成和爽约按钮 -->
                <a-space
                  v-else-if="appointmentStatus === 3"
                  direction="vertical"
                  size="medium"
                >
                  <a-alert type="info" show-icon>
                    {{ $t('schedulePatients.status.called') }}
                  </a-alert>
                  <a-space>
                    <a-button
                      type="primary"
                      :loading="completeLoading"
                      @click="handleComplete"
                    >
                      {{ $t('schedulePatients.actions.complete') }}
                    </a-button>
                    <a-button
                      status="danger"
                      :loading="noShowLoading"
                      @click="handleNoShow"
                    >
                      {{ $t('schedulePatients.actions.noShow') }}
                    </a-button>
                  </a-space>
                </a-space>

                <!-- Status 4: 已完成 -->
                <a-alert
                  v-else-if="appointmentStatus === 4"
                  type="success"
                  show-icon
                >
                  {{ $t('schedulePatients.status.completed') }}
                </a-alert>

                <!-- Status 5: 已取消 -->
                <a-alert
                  v-else-if="appointmentStatus === 5"
                  type="warning"
                  show-icon
                >
                  {{ $t('schedulePatients.status.cancelled') }}
                </a-alert>

                <!-- Status 6: 爽约 -->
                <a-alert
                  v-else-if="appointmentStatus === 6"
                  type="error"
                  show-icon
                >
                  {{ $t('schedulePatients.status.noShow') }}
                </a-alert>
              </div>
            </div>
            <a-empty
              v-else
              :description="$t('schedulePatients.selectPatient')"
            />
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, Ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { getSchedulePatients } from '@/api/doctor-profile';
  import type { SchedulePatientDTO } from '@/api/doctor-profile';
  import {
    getPatientProfiles,
    type PatientProfileListDTO,
    getPatientProfileByUserId,
    type PatientProfileDetailDTO,
  } from '@/api/patient-profile';
  import {
    getAppointments,
    callPatient,
    completeAppointment,
    noShowAppointment,
  } from '@/api/appointment';
  import { emergencyAppointSchedule } from '@/api/schedule';

  const APPOINTMENT_STATUS = {
    Unpaid: 1,
    Paid: 2,
    Called: 3,
    Completed: 4,
    Cancelled: 5,
    NoShow: 6,
  } as const;

  type AppointmentStatus =
    (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

  type PatientStatusMap = Map<number, AppointmentStatus>;

  const route = useRoute();
  const { t } = useI18n();

  const scheduleId = ref<number>(Number(route.params.scheduleId));
  const userId = ref<number>(Number(route.params.userId));

  const patients = ref<SchedulePatientDTO[]>([]);
  const patientsLoading = ref(false);

  const selectedPatientId = ref<number>();
  const patientDetail = ref<PatientProfileDetailDTO>();
  const detailLoading = ref(false);

  const emergencyPatientOptions = ref<PatientProfileListDTO[]>([]);
  const emergencySelectedPatientId = ref<number>();
  const emergencySearchLoading = ref(false);
  const emergencyAppointLoading = ref(false);

  const appointmentStatus = ref<AppointmentStatus>();
  const currentAppointmentId = ref<number>();

  const patientStatusMap = ref<PatientStatusMap>(new Map());
  const patientCheckInMap = ref<Map<number, boolean>>(new Map());

  const callLoading = ref(false);
  const completeLoading = ref(false);
  const noShowLoading = ref(false);

  const IDENTITY_TYPE_MAP: Record<number, string> = {
    1: t('schedulePatients.identityTypes.student'),
    2: t('schedulePatients.identityTypes.teacher'),
    3: t('schedulePatients.identityTypes.other'),
    0: t('schedulePatients.identityTypes.other'),
  };

  const STATUS_CLASS_MAP: Partial<Record<AppointmentStatus, string>> = {
    [APPOINTMENT_STATUS.Unpaid]: 'unpaid',
    [APPOINTMENT_STATUS.Paid]: 'paid',
    [APPOINTMENT_STATUS.Called]: 'called',
    [APPOINTMENT_STATUS.Completed]: 'completed',
    [APPOINTMENT_STATUS.Cancelled]: 'cancelled',
    [APPOINTMENT_STATUS.NoShow]: 'noshow',
  };

  const setPatientStatus = (
    userIdValue: number,
    status: AppointmentStatus | undefined
  ) => {
    if (!status) return;
    patientStatusMap.value.set(userIdValue, status);
    // trigger reactivity for Map
    patientStatusMap.value = new Map(patientStatusMap.value);
  };

  const setPatientCheckIn = (userIdValue: number, checkedIn: boolean) => {
    patientCheckInMap.value.set(userIdValue, checkedIn);
    patientCheckInMap.value = new Map(patientCheckInMap.value);
  };

  const handleRequestError = (err: any, fallbackKey: string) => {
    Message.error(err?.response?.data?.msg || t(fallbackKey));
  };

  const filterCancelledPatients = () => {
    patients.value = patients.value.filter(
      (patient) =>
        patientStatusMap.value.get(patient.userId) !==
        APPOINTMENT_STATUS.Cancelled
    );
  };

  const handleSearchPatients = async (keyword: string) => {
    if (!keyword) {
      emergencyPatientOptions.value = [];
      return;
    }

    try {
      emergencySearchLoading.value = true;
      const responses = await Promise.all([
        getPatientProfiles({ pageNum: 1, pageSize: 20, name: keyword }),
        getPatientProfiles({ pageNum: 1, pageSize: 20, userName: keyword }),
        getPatientProfiles({
          pageNum: 1,
          pageSize: 20,
          studentTeacherId: keyword,
        }),
      ]);

      const merged = new Map<number, PatientProfileListDTO>();
      responses.forEach(({ data }) => {
        (data.list || []).forEach((item) => merged.set(item.userId, item));
      });

      emergencyPatientOptions.value = Array.from(merged.values());
    } catch (err) {
      handleRequestError(err, 'schedulePatients.message.searchPatientError');
    } finally {
      emergencySearchLoading.value = false;
    }
  };

  const getLatestAppointment = async (patientUserId: number) => {
    const { data } = await getAppointments({
      scheduleId: scheduleId.value,
      patientUserId,
      pageNum: 1,
      pageSize: 1,
    });

    if (data.list && data.list.length > 0) {
      return data.list[0];
    }
    return undefined;
  };

  const refreshAppointmentState = async (patientUserId: number) => {
    const appointment = await getLatestAppointment(patientUserId);
    if (!appointment) {
      appointmentStatus.value = undefined;
      currentAppointmentId.value = undefined;
      setPatientCheckIn(patientUserId, false);
      return;
    }

    appointmentStatus.value = appointment.status as AppointmentStatus;
    currentAppointmentId.value = appointment.appointmentId;
    setPatientStatus(patientUserId, appointment.status as AppointmentStatus);
    setPatientCheckIn(patientUserId, Boolean(appointment.checkInTime));
  };

  const fetchAllPatientsStatus = async () => {
    patientStatusMap.value = new Map();
    patientCheckInMap.value = new Map();

    const statusPromises = patients.value.map(async (patient) => {
      try {
        const appointment = await getLatestAppointment(patient.userId);
        return appointment
          ? {
              userId: patient.userId,
              status: appointment.status as AppointmentStatus,
              checkedIn: Boolean(appointment.checkInTime),
            }
          : {
              userId: patient.userId,
              status: undefined,
              checkedIn: false,
            };
      } catch (err) {
        return null;
      }
    });

    const results = await Promise.allSettled(statusPromises);

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const { userId: patientUserId, status, checkedIn } = result.value;
        setPatientStatus(patientUserId, status);
        setPatientCheckIn(patientUserId, checkedIn);
      }
    });

    filterCancelledPatients();
  };

  // 获取时段患者列表
  const fetchPatients = async () => {
    try {
      patientsLoading.value = true;

      const { data } = await getSchedulePatients(
        userId.value,
        scheduleId.value
      );
      patients.value = data || [];

      await fetchAllPatientsStatus();
    } catch (err: any) {
      handleRequestError(err, 'schedulePatients.message.fetchPatientsError');
    } finally {
      patientsLoading.value = false;
    }
  };

  // 获取患者详情
  const fetchPatientDetail = async (patientUserId: number) => {
    try {
      detailLoading.value = true;
      const { data } = await getPatientProfileByUserId(patientUserId);
      patientDetail.value = data;

      await refreshAppointmentState(patientUserId);
    } catch (err: any) {
      // 如果是权限错误，给出友好提示
      if (err.response?.status === 401 || err.response?.status === 403) {
        Message.error('您没有查看患者档案的权限，请联系管理员');
      } else {
        handleRequestError(err, 'schedulePatients.message.fetchDetailError');
      }
    } finally {
      detailLoading.value = false;
    }
  };

  // 获取患者状态
  const getPatientStatus = (
    patientUserId: number
  ): AppointmentStatus | undefined => {
    return patientStatusMap.value.get(patientUserId);
  };

  const isCheckedIn = (patientUserId: number): boolean => {
    return patientCheckInMap.value.get(patientUserId) || false;
  };

  // 获取患者状态对应的样式类名
  const getStatusClass = (patientUserId: number): string => {
    const status = getPatientStatus(patientUserId);
    return status ? STATUS_CLASS_MAP[status] || '' : '';
  };

  // 选择患者
  const handleSelectPatient = (patientUserId: number) => {
    if (getPatientStatus(patientUserId) === APPOINTMENT_STATUS.Unpaid) {
      return;
    }
    selectedPatientId.value = patientUserId;
    fetchPatientDetail(patientUserId);
  };

  const runAppointmentAction = async (
    action: (appointmentId: number) => Promise<unknown>,
    loadingRef: Ref<boolean>,
    successKey: string,
    errorKey: string
  ) => {
    if (!currentAppointmentId.value || !selectedPatientId.value) return;
    try {
      loadingRef.value = true;
      await action(currentAppointmentId.value);
      Message.success(t(successKey));
      await refreshAppointmentState(selectedPatientId.value);
    } catch (err: any) {
      handleRequestError(err, errorKey);
    } finally {
      loadingRef.value = false;
    }
  };

  const handleCall = () =>
    runAppointmentAction(
      callPatient,
      callLoading,
      'schedulePatients.message.callSuccess',
      'schedulePatients.message.callError'
    );

  const handleComplete = () =>
    runAppointmentAction(
      completeAppointment,
      completeLoading,
      'schedulePatients.message.completeSuccess',
      'schedulePatients.message.completeError'
    );

  const handleNoShow = () =>
    runAppointmentAction(
      noShowAppointment,
      noShowLoading,
      'schedulePatients.message.noShowSuccess',
      'schedulePatients.message.noShowError'
    );

  const handleEmergencyAppoint = async () => {
    if (!emergencySelectedPatientId.value) return;
    try {
      emergencyAppointLoading.value = true;
      await emergencyAppointSchedule(
        scheduleId.value,
        emergencySelectedPatientId.value
      );
      Message.success(t('schedulePatients.message.emergencyAppointSuccess'));
      await fetchPatients();
      selectedPatientId.value = emergencySelectedPatientId.value;
      await fetchPatientDetail(emergencySelectedPatientId.value);
    } catch (err) {
      handleRequestError(err, 'schedulePatients.message.emergencyAppointError');
    } finally {
      emergencyAppointLoading.value = false;
    }
  };

  const getIdentityTypeText = (type: number) => IDENTITY_TYPE_MAP[type] || '-';

  onMounted(() => {
    fetchPatients();
  });

  // 监听路由参数变化，重新获取数据
  watch(
    () => route.params.scheduleId,
    (newScheduleId) => {
      if (newScheduleId) {
        scheduleId.value = Number(newScheduleId);
        selectedPatientId.value = undefined;
        patientDetail.value = undefined;
        fetchPatients();
      }
    }
  );
</script>

<style lang="less" scoped>
  .schedule-patients-page {
    padding: 20px;
    background-color: var(--color-fill-1);
    min-height: calc(100vh - 60px);

    .content-row {
      height: 100%;
    }

    :deep(.arco-card) {
      height: 100%;

      .arco-card-body {
        height: calc(100% - 60px);
        overflow-y: auto;
      }
    }

    .emergency-appoint {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
    }

    .patient-option {
      display: flex;
      flex-direction: column;
      gap: 4px;

      &__name {
        font-weight: 600;
        color: var(--color-text-1);
      }

      &__username {
        color: var(--color-text-3);
        margin-left: 4px;
      }

      &__meta {
        font-size: 12px;
        color: var(--color-text-3);
      }
    }

    // 状态图例样式
    .status-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 8px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--color-text-2);

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-text {
          white-space: nowrap;
        }
      }
    }

    // 患者列表项样式
    .patient-item {
      cursor: pointer;
      padding: 12px;
      border-radius: 4px;
      transition: all 0.3s;
      border-left: 3px solid transparent;
      position: relative;

      &:hover:not(.disabled) {
        background-color: var(--color-fill-2);
      }

      &.active {
        background-color: rgb(var(--primary-1));
        border-left-color: rgb(var(--primary-6));
      }

      // 禁用状态（爽约）
      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
        background-color: var(--color-fill-1);

        .patient-name,
        .patient-details {
          color: var(--color-text-4);
        }
      }

      // 不同状态的左侧边框颜色
      &.status-unpaid:not(.active) {
        border-left-color: var(--color-text-4);
      }

      &.status-paid:not(.active) {
        border-left-color: rgb(var(--green-6));
      }

      &.status-called:not(.active) {
        border-left-color: rgb(var(--blue-6));
      }

      &.status-completed:not(.active) {
        border-left-color: rgb(var(--arcoblue-6));
      }

      &.status-noshow:not(.active) {
        border-left-color: rgb(var(--red-6));
      }

      &.checked-in {
        box-shadow: 0 0 0 1px rgba(var(--green-6), 0.5);
      }

      .patient-info {
        width: 100%;

        .patient-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-text-1);
          display: flex;
          align-items: center;
          gap: 8px;

          .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
          }
        }

        .patient-details {
          font-size: 14px;
          color: var(--color-text-3);
        }
      }
    }

    .check-in-tag {
      margin-left: 4px;
      border-radius: 10px;
    }

    // 状态指示器颜色
    .patient-item.status-unpaid .status-indicator {
      background-color: var(--color-text-4);
    }

    .patient-item.status-paid .status-indicator {
      background-color: rgb(var(--green-6));
    }

    .patient-item.status-called .status-indicator {
      background-color: rgb(var(--blue-6));
    }

    .patient-item.status-completed .status-indicator {
      background-color: rgb(var(--arcoblue-6));
    }

    .patient-item.status-noshow .status-indicator {
      background-color: rgb(var(--red-6));
    }

    // 图例颜色
    .legend-dot.status-unpaid {
      background-color: var(--color-text-4);
    }

    .legend-dot.status-paid {
      background-color: rgb(var(--green-6));
    }

    .legend-dot.status-called {
      background-color: rgb(var(--blue-6));
    }

    .legend-dot.status-completed {
      background-color: rgb(var(--arcoblue-6));
    }

    .legend-dot.status-noshow {
      background-color: rgb(var(--red-6));
    }

    .appointment-actions {
      padding: 16px;
      background-color: var(--color-fill-2);
      border-radius: 8px;
    }
  }
</style>
