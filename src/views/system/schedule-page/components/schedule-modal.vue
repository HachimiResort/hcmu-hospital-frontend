<template>
  <a-modal
    :visible="visible"
    :title="
      isEdit
        ? $t('schedulePage.modal.editTitle')
        : $t('schedulePage.modal.addTitle')
    "
    :mask-closable="false"
    width="600px"
    @cancel="handleCancel"
    @before-ok="handleOk"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <!-- 医生选择 -->
      <a-form-item
        field="doctorUserId"
        :label="$t('schedulePage.modal.form.doctorUserId')"
      >
        <a-select
          v-model="form.doctorUserId"
          :placeholder="$t('schedulePage.modal.form.doctorUserId.placeholder')"
          :disabled="isEdit"
          allow-search
        >
          <a-option
            v-for="doctor in doctorOptions"
            :key="doctor.userId"
            :value="doctor.userId"
            :label="doctor.userName"
          />
        </a-select>
      </a-form-item>

      <!-- 排班日期 -->
      <a-form-item
        field="scheduleDate"
        :label="$t('schedulePage.modal.form.scheduleDate')"
      >
        <a-date-picker
          v-model="form.scheduleDate"
          :placeholder="$t('schedulePage.modal.form.scheduleDate.placeholder')"
          :disabled="isEdit"
          style="width: 100%"
        />
      </a-form-item>

      <!-- 号别 -->
      <a-form-item
        field="slotType"
        :label="$t('schedulePage.modal.form.slotType')"
      >
        <a-select
          v-model="form.slotType"
          :placeholder="$t('schedulePage.modal.form.slotType.placeholder')"
        >
          <a-option :value="1" :label="$t('schedulePage.slotType.normal')" />
          <a-option :value="2" :label="$t('schedulePage.slotType.expert')" />
          <a-option :value="3" :label="$t('schedulePage.slotType.special')" />
        </a-select>
      </a-form-item>

      <!-- 时段 -->
      <a-form-item
        field="slotPeriod"
        :label="$t('schedulePage.modal.form.slotPeriod')"
      >
        <a-select
          v-model="form.slotPeriod"
          :placeholder="$t('schedulePage.modal.form.slotPeriod.placeholder')"
        >
          <a-option :value="1" label="上午8:00-8:30" />
          <a-option :value="2" label="上午8:30-9:00" />
          <a-option :value="3" label="上午9:00-9:30" />
          <a-option :value="4" label="上午9:30-10:00" />
          <a-option :value="5" label="上午10:00-10:30" />
          <a-option :value="6" label="上午10:30-11:00" />
          <a-option :value="7" label="下午13:30-14:00" />
          <a-option :value="8" label="下午14:00-14:30" />
          <a-option :value="9" label="下午14:30-15:00" />
          <a-option :value="10" label="下午15:00-15:30" />
          <a-option :value="11" label="下午15:30-16:00" />
          <a-option :value="12" label="下午16:00-16:30" />
        </a-select>
      </a-form-item>

      <!-- 总号源数 -->
      <a-form-item
        field="totalSlots"
        :label="$t('schedulePage.modal.form.totalSlots')"
      >
        <a-input-number
          v-model="form.totalSlots"
          :placeholder="$t('schedulePage.modal.form.totalSlots.placeholder')"
          :min="1"
          style="width: 100%"
        />
      </a-form-item>

      <!-- 剩余号源数(仅编辑时显示，只读) -->
      <a-form-item
        v-if="isEdit"
        field="availableSlots"
        :label="$t('schedulePage.modal.form.availableSlots')"
      >
        <a-input-number
          v-model="form.availableSlots"
          :placeholder="
            $t('schedulePage.modal.form.availableSlots.placeholder')
          "
          :min="0"
          :max="form.totalSlots"
          :disabled="true"
          style="width: 100%"
        />
      </a-form-item>

      <!-- 挂号费 -->
      <a-form-item field="fee" :label="$t('schedulePage.modal.form.fee')">
        <a-input-number
          v-model="form.fee"
          :placeholder="$t('schedulePage.modal.form.fee.placeholder')"
          :min="0"
          :precision="2"
          style="width: 100%"
        >
          <template #suffix>元</template>
        </a-input-number>
      </a-form-item>

      <!-- 状态 -->
      <a-form-item field="status" :label="$t('schedulePage.modal.form.status')">
        <a-select
          v-model="form.status"
          :placeholder="$t('schedulePage.modal.form.status.placeholder')"
        >
          <a-option :value="1" :label="$t('schedulePage.status.open')" />
          <a-option :value="0" :label="$t('schedulePage.status.closed')" />
        </a-select>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="handleCancel">{{ $t('common.cancel') }}</a-button>
        <a-button v-if="isEdit" type="outline" @click="handleViewPatients">
          {{ $t('schedulePage.button.viewPatients') }}
        </a-button>
        <a-button type="primary" @click="handleOk">{{
          $t('common.confirm')
        }}</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import {
    createSchedule,
    updateSchedule,
    getScheduleById,
    ScheduleCreateDTO,
    ScheduleUpdateDTO,
  } from '@/api/schedule';
  import {
    getAllDoctorProfiles,
    DoctorProfileListDTO,
  } from '@/api/doctor-profile';

  const props = defineProps<{
    visible: boolean;
    scheduleId?: number;
    doctorUserId?: number;
    scheduleDate?: string;
    slotPeriod?: number;
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'success'): void;
  }>();

  const { t } = useI18n();
  const formRef = ref<FormInstance>();
  const router = useRouter();

  // 是否为编辑模式
  const isEdit = computed(() => !!props.scheduleId);

  // 表单数据
  const form = reactive<ScheduleCreateDTO & { availableSlots?: number }>({
    doctorUserId: undefined as any,
    scheduleDate: '',
    slotType: 1,
    slotPeriod: undefined as any,
    totalSlots: undefined as any,
    availableSlots: undefined,
    fee: undefined as any,
    status: 1,
  });

  // 医生选项
  const doctorOptions = ref<DoctorProfileListDTO[]>([]);

  // 表单验证规则
  const rules = {
    doctorUserId: [
      {
        required: true,
        message: t('schedulePage.modal.form.doctorUserId.required'),
      },
    ],
    scheduleDate: [
      {
        required: true,
        message: t('schedulePage.modal.form.scheduleDate.required'),
      },
    ],
    slotType: [
      {
        required: true,
        message: t('schedulePage.modal.form.slotType.required'),
      },
    ],
    slotPeriod: [
      {
        required: true,
        message: t('schedulePage.modal.form.slotPeriod.required'),
      },
    ],
    totalSlots: [
      {
        required: true,
        message: t('schedulePage.modal.form.totalSlots.required'),
      },
    ],
    fee: [
      {
        required: true,
        message: t('schedulePage.modal.form.fee.required'),
      },
    ],
    status: [
      {
        required: true,
        message: t('schedulePage.modal.form.status.required'),
      },
    ],
  };

  // 获取医生列表
  const fetchDoctors = async () => {
    try {
      const { data } = await getAllDoctorProfiles({
        pageNum: 1,
        pageSize: 1000,
      });
      doctorOptions.value = data.list;
    } catch (err) {
      // Message.error(t('schedulePage.message.fetchDoctorsError'));
    }
  };

  // 获取排班详情
  const fetchScheduleDetail = async (scheduleId: number) => {
    try {
      const { data } = await getScheduleById(scheduleId);
      form.doctorUserId = data.doctorUserId;
      form.scheduleDate = data.scheduleDate;
      form.slotType = data.slotType;
      form.slotPeriod = data.slotPeriod;
      form.totalSlots = data.totalSlots;
      form.availableSlots = data.availableSlots;
      form.fee = data.fee;
      form.status = data.status;
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg || t('schedulePage.message.fetchDetailError')
      );
    }
  };

  // 重置表单
  const resetForm = () => {
    form.doctorUserId = undefined as any;
    form.scheduleDate = '';
    form.slotType = 1;
    form.slotPeriod = undefined as any;
    form.totalSlots = undefined as any;
    form.availableSlots = undefined;
    form.fee = undefined as any;
    form.status = 1;
    formRef.value?.clearValidate();
  };

  // 处理取消
  const handleCancel = () => {
    resetForm();
    emit('cancel');
  };

  // 处理确认
  const handleOk = async () => {
    const valid = await formRef.value?.validate();
    if (valid) {
      return false;
    }

    try {
      if (isEdit.value && props.scheduleId) {
        // 编辑模式
        const updateData: ScheduleUpdateDTO = {
          doctorUserId: form.doctorUserId,
          scheduleDate: dayjs(form.scheduleDate).format('YYYY-MM-DD'),
          slotType: form.slotType,
          slotPeriod: form.slotPeriod,
          totalSlots: form.totalSlots,
          availableSlots: form.availableSlots,
          fee: form.fee,
          status: form.status,
        };
        console.log('更新排班数据:', updateData);
        await updateSchedule(props.scheduleId, updateData);
        Message.success(t('schedulePage.message.updateSuccess'));
      } else {
        // 新增模式
        const createData: ScheduleCreateDTO = {
          doctorUserId: form.doctorUserId,
          scheduleDate: dayjs(form.scheduleDate).format('YYYY-MM-DD'),
          slotType: form.slotType,
          slotPeriod: form.slotPeriod,
          totalSlots: form.totalSlots,
          fee: form.fee,
          status: form.status,
        };
        console.log('创建排班数据:', createData);
        await createSchedule(createData);
        Message.success(t('schedulePage.message.createSuccess'));
      }
      resetForm();
      emit('success');
      return true;
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg ||
          t(
            isEdit.value
              ? 'schedulePage.message.updateError'
              : 'schedulePage.message.createError'
          )
      );
      return false;
    }
  };

  // 查看排班患者
  const handleViewPatients = () => {
    if (!props.scheduleId || !form.doctorUserId) {
      Message.warning(t('schedulePage.message.fetchDetailError'));
      return;
    }
    router.push({
      name: 'SchedulePatients',
      params: {
        scheduleId: props.scheduleId,
        userId: form.doctorUserId,
      },
    });
  };

  // 监听弹窗打开
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        fetchDoctors();
        if (props.scheduleId) {
          fetchScheduleDetail(props.scheduleId);
        } else {
          // 新增模式，使用传入的默认值
          if (props.doctorUserId) {
            form.doctorUserId = props.doctorUserId;
          }
          if (props.scheduleDate) {
            form.scheduleDate = props.scheduleDate;
          }
          if (props.slotPeriod) {
            form.slotPeriod = props.slotPeriod;
          }
        }
      }
    }
  );
</script>
