<template>
  <a-modal
    :visible="visible"
    :title="$t('schedulePage.copyModal.title')"
    :mask-closable="false"
    width="500px"
    @cancel="handleCancel"
    @before-ok="handleOk"
  >
    <a-alert style="margin-bottom: 16px" type="info">
      {{ $t('schedulePage.copyModal.tips') }}
    </a-alert>

    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <!-- 医生选择 -->
      <a-form-item
        field="doctorUserId"
        :label="$t('schedulePage.copyModal.form.doctorUserId')"
      >
        <a-select
          v-model="form.doctorUserId"
          :placeholder="
            $t('schedulePage.copyModal.form.doctorUserId.placeholder')
          "
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

      <!-- 目标日期 -->
      <a-form-item
        field="targetDate"
        :label="$t('schedulePage.copyModal.form.targetDate')"
      >
        <a-date-picker
          v-model="form.targetDate"
          :placeholder="
            $t('schedulePage.copyModal.form.targetDate.placeholder')
          "
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import { copySchedule, ScheduleCopyDTO } from '@/api/schedule';
  import {
    getAllDoctorProfiles,
    DoctorProfileListDTO,
  } from '@/api/doctor-profile';

  const props = defineProps<{
    visible: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'success'): void;
  }>();

  const { t } = useI18n();
  const formRef = ref<FormInstance>();

  // 表单数据
  const form = reactive<ScheduleCopyDTO & { targetDate: any }>({
    doctorUserId: undefined as any,
    targetDate: '',
  });

  // 医生选项
  const doctorOptions = ref<DoctorProfileListDTO[]>([]);

  // 表单验证规则
  const rules = {
    doctorUserId: [
      {
        required: true,
        message: t('schedulePage.copyModal.form.doctorUserId.required'),
      },
    ],
    targetDate: [
      {
        required: true,
        message: t('schedulePage.copyModal.form.targetDate.required'),
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

  // 重置表单
  const resetForm = () => {
    form.doctorUserId = undefined as any;
    form.targetDate = '';
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
      const copyData: ScheduleCopyDTO = {
        doctorUserId: form.doctorUserId,
        targetDate: dayjs(form.targetDate).format('YYYY-MM-DD'),
      };
      await copySchedule(copyData);
      Message.success(t('schedulePage.message.copySuccess'));
      resetForm();
      emit('success');
      return true;
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg || t('schedulePage.message.copyError')
      );
      return false;
    }
  };

  // 监听弹窗打开
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        fetchDoctors();
      }
    }
  );
</script>
