<template>
  <a-modal
    :visible="visible"
    :title="$t('patientProfilePage.modal.editTitle')"
    :mask-closable="false"
    @cancel="handleCancel"
    @before-ok="handleOk"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item
        field="identityType"
        :label="$t('patientProfilePage.modal.form.identityType')"
      >
        <a-select
          v-model="form.identityType"
          allow-search
          :placeholder="
            $t('patientProfilePage.modal.form.identityType.placeholder')
          "
        >
          <a-option
            v-for="item in identityOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </a-select>
      </a-form-item>

      <a-form-item
        field="studentTeacherId"
        :label="$t('patientProfilePage.modal.form.studentTeacherId')"
      >
        <a-input v-model="form.studentTeacherId" />
      </a-form-item>

      <a-row :gutter="10">
        <a-col :span="12">
          <a-form-item
            field="emergencyContact"
            :label="$t('patientProfilePage.modal.form.emergencyContact')"
          >
            <a-input v-model="form.emergencyContact" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            field="emergencyContactPhone"
            :label="$t('patientProfilePage.modal.form.emergencyContactPhone')"
          >
            <a-input v-model="form.emergencyContactPhone" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        field="medicalHistory"
        :label="$t('patientProfilePage.modal.form.medicalHistory')"
      >
        <a-textarea
          v-model="form.medicalHistory"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>

      <a-form-item
        field="allergyHistory"
        :label="$t('patientProfilePage.modal.form.allergyHistory')"
      >
        <a-textarea
          v-model="form.allergyHistory"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import {
    getPatientProfileByUserId,
    updatePatientProfile,
    PatientProfileUpdateDTO,
  } from '@/api/patient-profile';

  const props = defineProps<{ visible: boolean; userId?: number }>();
  const emit = defineEmits<{ (e: 'cancel'): void; (e: 'success'): void }>();

  const { t } = useI18n();
  const formRef = ref<FormInstance>();

  const form = reactive<PatientProfileUpdateDTO & Record<string, any>>({
    identityType: undefined,
    studentTeacherId: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    medicalHistory: '',
    allergyHistory: '',
  });

  const identityOptions = ref([
    { value: 1, label: t('patientProfilePage.identity.student') },
    { value: 2, label: t('patientProfilePage.identity.teacher') },
    { value: 3, label: t('patientProfilePage.identity.other') },
  ]);

  const rules = {};

  const resetForm = () => {
    form.identityType = undefined;
    form.studentTeacherId = '';
    form.emergencyContact = '';
    form.emergencyContactPhone = '';
    form.medicalHistory = '';
    form.allergyHistory = '';
    formRef.value?.clearValidate();
  };

  const handleCancel = () => {
    resetForm();
    emit('cancel');
  };

  const handleOk = async () => {
    const valid = await formRef.value?.validate();
    if (valid) {
      return false;
    }

    try {
      if (props.userId) {
        const updateData: PatientProfileUpdateDTO = {
          identityType: form.identityType,
          studentTeacherId: form.studentTeacherId,
          emergencyContact: form.emergencyContact,
          emergencyContactPhone: form.emergencyContactPhone,
          medicalHistory: form.medicalHistory,
          allergyHistory: form.allergyHistory,
        };
        await updatePatientProfile(props.userId, updateData);
        Message.success(t('patientProfilePage.message.updateSuccess'));
      }
      resetForm();
      emit('success');
      return true;
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg || t('patientProfilePage.message.updateError')
      );
      return false;
    }
  };

  const fetchDetail = async (userId: number) => {
    try {
      const { data } = await getPatientProfileByUserId(userId);
      form.identityType = data.identityType;
      form.studentTeacherId = data.studentTeacherId ?? '';
      form.emergencyContact = data.emergencyContact ?? '';
      form.emergencyContactPhone = data.emergencyContactPhone ?? '';
      form.medicalHistory = data.medicalHistory ?? '';
      form.allergyHistory = data.allergyHistory ?? '';
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg ||
          t('patientProfilePage.message.fetchDetailError')
      );
    }
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        if (props.userId) {
          fetchDetail(props.userId);
        }
      }
    }
  );
</script>
