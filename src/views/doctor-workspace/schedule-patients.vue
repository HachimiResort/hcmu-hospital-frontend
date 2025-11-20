<template>
  <div class="schedule-patients-page">
    <a-row :gutter="20" class="content-row">
      <!-- 左侧患者列表 -->
      <a-col :span="8">
        <a-card :title="$t('schedulePatients.patientList')" :bordered="false">
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
                  active: selectedPatientId === patient.userId,
                  disabled: getPatientStatus(patient.userId) === 1,
                  [`status-${getStatusClass(patient.userId)}`]: true,
                }"
                @click="handleSelectPatient(patient.userId)"
              >
                <div class="patient-info">
                  <div class="patient-name">
                    <span class="status-indicator"></span>
                    {{ patient.name }}
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
                  :message="$t('schedulePatients.status.unpaid')"
                  show-icon
                />

                <!-- Status 2: 已支付,显示传呼按钮 -->
                <a-space
                  v-else-if="appointmentStatus === 2"
                  direction="vertical"
                  size="medium"
                >
                  <a-alert
                    type="success"
                    :message="$t('schedulePatients.status.paid')"
                    show-icon
                  />
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
                  <a-alert
                    type="info"
                    :message="$t('schedulePatients.status.called')"
                    show-icon
                  />
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
                  :message="$t('schedulePatients.status.completed')"
                  show-icon
                />

                <!-- Status 5: 已取消 -->
                <a-alert
                  v-else-if="appointmentStatus === 5"
                  type="warning"
                  :message="$t('schedulePatients.status.cancelled')"
                  show-icon
                />

                <!-- Status 6: 爽约 -->
                <a-alert
                  v-else-if="appointmentStatus === 6"
                  type="error"
                  :message="$t('schedulePatients.status.noShow')"
                  show-icon
                />
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
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import axios from 'axios';
  import { getPatientProfileByUserId } from '@/api/patient-profile';
  import {
    getAppointments,
    callPatient,
    completeAppointment,
    noShowAppointment,
  } from '@/api/appointment';

  interface SchedulePatientDTO {
    userId: number;
    userName: string;
    name: string;
    sex: string;
    email: string;
    phone: string;
  }

  interface PatientProfileDetailDTO {
    patientProfileId: number;
    userId: number;
    userName: string;
    name: string;
    identityType: number;
    studentTeacherId?: string;
    emergencyContact?: string;
    emergencyContactPhone?: string;
    medicalHistory?: string;
    allergyHistory?: string;
  }

  const route = useRoute();
  const { t } = useI18n();

  const scheduleId = ref<number>(Number(route.params.scheduleId));
  const userId = ref<number>(Number(route.params.userId));

  const patients = ref<SchedulePatientDTO[]>([]);
  const patientsLoading = ref(false);

  const selectedPatientId = ref<number>();
  const patientDetail = ref<PatientProfileDetailDTO>();
  const detailLoading = ref(false);

  const appointmentStatus = ref<number>();
  const currentAppointmentId = ref<number>();

  // 存储所有患者的预约状态
  const patientStatusMap = ref<Map<number, number>>(new Map());

  const callLoading = ref(false);
  const completeLoading = ref(false);
  const noShowLoading = ref(false);

  // 批量获取所有患者的预约状态
  const fetchAllPatientsStatus = async () => {
    // 清空旧的状态
    patientStatusMap.value = new Map();

    // 为每个患者创建获取状态的Promise
    const statusPromises = patients.value.map(async (patient) => {
      try {
        const { data } = await getAppointments({
          scheduleId: scheduleId.value,
          patientUserId: patient.userId,
          pageNum: 1,
          pageSize: 1,
        });

        if (data.list && data.list.length > 0) {
          return { userId: patient.userId, status: data.list[0].status };
        }
        return null;
      } catch (err) {
        return null;
      }
    });

    // 等待所有请求完成
    const results = await Promise.all(statusPromises);

    // 将结果存入Map，同时过滤掉已取消的患者
    results.forEach((result) => {
      if (result) {
        patientStatusMap.value.set(result.userId, result.status);
      }
    });

    // 过滤掉状态为5(已取消)的患者
    patients.value = patients.value.filter(
      (patient) => patientStatusMap.value.get(patient.userId) !== 5
    );

    // 强制触发响应式更新
    patientStatusMap.value = new Map(patientStatusMap.value);
  };

  // 获取时段患者列表
  const fetchPatients = async () => {
    try {
      patientsLoading.value = true;

      const response = await axios.get(
        `/doctor-profiles/${userId.value}/schedules/${scheduleId.value}/patients`
      );
      patients.value = response.data || [];

      // 获取所有患者的预约状态
      await fetchAllPatientsStatus();
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg ||
          t('schedulePatients.message.fetchPatientsError')
      );
    } finally {
      patientsLoading.value = false;
    }
  };

  // 获取预约状态
  const fetchAppointmentStatus = async (patientUserId: number) => {
    try {
      const { data } = await getAppointments({
        scheduleId: scheduleId.value,
        patientUserId,
        pageNum: 1,
        pageSize: 1,
      });

      if (data.list && data.list.length > 0) {
        const appointment = data.list[0];
        appointmentStatus.value = appointment.status;
        currentAppointmentId.value = appointment.appointmentId;
      }
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg ||
          t('schedulePatients.message.fetchAppointmentError')
      );
    }
  };

  // 获取患者详情
  const fetchPatientDetail = async (patientUserId: number) => {
    try {
      detailLoading.value = true;
      const { data } = await getPatientProfileByUserId(patientUserId);
      patientDetail.value = data;

      // 获取该患者的预约信息
      await fetchAppointmentStatus(patientUserId);
    } catch (err: any) {
      // 如果是权限错误，给出友好提示
      if (err.response?.status === 401 || err.response?.status === 403) {
        Message.error('您没有查看患者档案的权限，请联系管理员');
      } else {
        Message.error(
          err.response?.data?.msg ||
            t('schedulePatients.message.fetchDetailError')
        );
      }
    } finally {
      detailLoading.value = false;
    }
  };

  // 获取患者状态
  const getPatientStatus = (patientUserId: number): number | undefined => {
    return patientStatusMap.value.get(patientUserId);
  };

  // 获取患者状态对应的样式类名
  const getStatusClass = (patientUserId: number): string => {
    const status = getPatientStatus(patientUserId);
    switch (status) {
      case 1:
        return 'unpaid';
      case 2:
        return 'paid';
      case 3:
        return 'called';
      case 4:
        return 'completed';
      case 5:
        return 'cancelled'; // 已取消(不会显示在列表中)
      case 6:
        return 'noshow';
      default:
        return '';
    }
  };

  // 选择患者
  const handleSelectPatient = (patientUserId: number) => {
    // 如果是未支付状态，不允许点击
    if (getPatientStatus(patientUserId) === 1) {
      return;
    }
    selectedPatientId.value = patientUserId;
    fetchPatientDetail(patientUserId);
  };

  // 传呼
  const handleCall = async () => {
    if (!currentAppointmentId.value) return;

    try {
      callLoading.value = true;
      await callPatient(currentAppointmentId.value);
      Message.success(t('schedulePatients.message.callSuccess'));
      // 刷新预约状态
      if (selectedPatientId.value) {
        await fetchAppointmentStatus(selectedPatientId.value);
        // 更新状态映射表
        if (appointmentStatus.value) {
          patientStatusMap.value.set(
            selectedPatientId.value,
            appointmentStatus.value
          );
        }
      }
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg || t('schedulePatients.message.callError')
      );
    } finally {
      callLoading.value = false;
    }
  };

  // 完成就诊
  const handleComplete = async () => {
    if (!currentAppointmentId.value) return;

    try {
      completeLoading.value = true;
      await completeAppointment(currentAppointmentId.value);
      Message.success(t('schedulePatients.message.completeSuccess'));
      // 刷新预约状态
      if (selectedPatientId.value) {
        await fetchAppointmentStatus(selectedPatientId.value);
        // 更新状态映射表
        if (appointmentStatus.value) {
          patientStatusMap.value.set(
            selectedPatientId.value,
            appointmentStatus.value
          );
        }
      }
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg || t('schedulePatients.message.completeError')
      );
    } finally {
      completeLoading.value = false;
    }
  };

  // 爽约
  const handleNoShow = async () => {
    if (!currentAppointmentId.value || !selectedPatientId.value) return;

    try {
      noShowLoading.value = true;
      await noShowAppointment(currentAppointmentId.value);
      Message.success(t('schedulePatients.message.noShowSuccess'));

      // 重新获取该患者的预约状态
      const { data } = await getAppointments({
        scheduleId: scheduleId.value,
        patientUserId: selectedPatientId.value,
        pageNum: 1,
        pageSize: 1,
      });

      if (data.list && data.list.length > 0) {
        const newStatus = data.list[0].status;
        patientStatusMap.value.set(selectedPatientId.value, newStatus);
        appointmentStatus.value = newStatus;

        // 强制触发响应式更新
        patientStatusMap.value = new Map(patientStatusMap.value);
      }
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg || t('schedulePatients.message.noShowError')
      );
    } finally {
      noShowLoading.value = false;
    }
  };

  // 获取身份类型文本
  const getIdentityTypeText = (type: number) => {
    const typeMap: Record<number, string> = {
      1: t('schedulePatients.identityTypes.student'),
      2: t('schedulePatients.identityTypes.teacher'),
      3: t('schedulePatients.identityTypes.other'),
    };
    return typeMap[type] || '-';
  };

  onMounted(() => {
    fetchPatients();
  });

  // 监听路由参数变化，重新获取数据
  watch(
    () => route.params.scheduleId,
    (newScheduleId) => {
      if (newScheduleId) {
        scheduleId.value = Number(newScheduleId);
        // 清除选中状态
        selectedPatientId.value = undefined;
        patientDetail.value = undefined;
        // 重新获取患者列表和状态
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
