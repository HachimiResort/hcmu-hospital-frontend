<template>
  <a-modal
    :visible="visible"
    :title="
      isEdit
        ? $t('mapPage.modal.editPointTitle')
        : $t('mapPage.modal.createPointTitle')
    "
    :mask-closable="false"
    @cancel="handleCancel"
    @before-ok="handleOk"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item field="mapId" :label="$t('mapPage.modal.form.mapId')">
        <a-select
          v-model="form.mapId"
          :placeholder="$t('mapPage.modal.form.mapId.placeholder')"
          :options="mapOptions"
        />
      </a-form-item>

      <a-form-item field="type" :label="$t('mapPage.modal.form.type')">
        <a-select
          v-model="form.type"
          :placeholder="$t('mapPage.modal.form.type.placeholder')"
          :options="typeOptions"
        />
      </a-form-item>

      <a-form-item field="x" :label="$t('mapPage.modal.form.x')">
        <a-input-number
          v-model="form.x"
          :placeholder="$t('mapPage.modal.form.x.placeholder')"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item field="y" :label="$t('mapPage.modal.form.y')">
        <a-input-number
          v-model="form.y"
          :placeholder="$t('mapPage.modal.form.y.placeholder')"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item
        field="pointName"
        :label="$t('mapPage.modal.form.pointName')"
      >
        <a-input
          v-model="form.pointName"
          :placeholder="$t('mapPage.modal.form.pointName.placeholder')"
        />
      </a-form-item>

      <a-form-item field="roomCode" :label="$t('mapPage.modal.form.roomCode')">
        <a-input
          v-model="form.roomCode"
          :placeholder="$t('mapPage.modal.form.roomCode.placeholder')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import {
    createMapPoint,
    getMapPointById,
    updateMapPoint,
    MapPointCreateDTO,
    MapPointUpdateDTO,
  } from '@/api/map';

  const props = defineProps<{
    visible: boolean;
    isEdit: boolean;
    pointId?: number;
    mapOptions: Array<{ label: string; value: number }>;
    defaultMapId?: number | null;
    initialPoint?: { mapId?: number; x?: number; y?: number };
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'success'): void;
  }>();

  const { t } = useI18n();
  const formRef = ref<FormInstance>();

  const form = reactive({
    mapId: props.defaultMapId ?? undefined,
    x: undefined as number | undefined,
    y: undefined as number | undefined,
    type: undefined as number | undefined,
    pointName: '',
    roomCode: '',
  });

  const typeOptions = computed(() => [
    { value: 0, label: t('mapPage.pointType.path') },
    { value: 1, label: t('mapPage.pointType.room') },
    { value: 2, label: t('mapPage.pointType.teleport') },
  ]);

  const rules = {
    mapId: [
      { required: true, message: t('mapPage.modal.form.mapId.required') },
    ],
    type: [{ required: true, message: t('mapPage.modal.form.type.required') }],
    x: [{ required: true, message: t('mapPage.modal.form.x.required') }],
    y: [{ required: true, message: t('mapPage.modal.form.y.required') }],
  };

  const resetForm = () => {
    form.mapId = props.defaultMapId ?? undefined;
    form.x = undefined;
    form.y = undefined;
    form.type = undefined;
    form.pointName = '';
    form.roomCode = '';
    formRef.value?.clearValidate();
  };

  const handleCancel = () => {
    resetForm();
    emit('cancel');
  };

  const fetchDetail = async (pointId: number) => {
    try {
      const { data } = await getMapPointById(pointId);
      form.mapId = data.mapId;
      form.x = data.x;
      form.y = data.y;
      form.type = data.type;
      form.pointName = data.pointName || '';
      form.roomCode = data.roomCode || '';
    } catch (err) {
      Message.error(t('mapPage.message.fetchPointsError'));
    }
  };

  const handleOk = async () => {
    const valid = await formRef.value?.validate();
    if (valid) {
      return false;
    }

    try {
      if (props.isEdit && props.pointId) {
        const payload: MapPointUpdateDTO = {
          mapId: form.mapId as number,
          x: form.x as number,
          y: form.y as number,
          type: form.type as number,
          pointName: form.pointName?.trim() || undefined,
          roomCode: form.roomCode?.trim() || undefined,
        };
        await updateMapPoint(props.pointId, payload);
        Message.success(t('mapPage.message.updatePointSuccess'));
      } else {
        const payload: MapPointCreateDTO = {
          mapId: form.mapId as number,
          x: form.x as number,
          y: form.y as number,
          type: form.type as number,
          pointName: form.pointName?.trim() || undefined,
          roomCode: form.roomCode?.trim() || undefined,
        };
        await createMapPoint(payload);
        Message.success(t('mapPage.message.createPointSuccess'));
      }
      resetForm();
      emit('success');
      return true;
    } catch (err) {
      Message.error(
        props.isEdit
          ? t('mapPage.message.updatePointError')
          : t('mapPage.message.createPointError')
      );
      return false;
    }
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        if (props.isEdit && props.pointId) {
          fetchDetail(props.pointId);
        } else {
          resetForm();
          if (props.initialPoint) {
            form.mapId = props.initialPoint.mapId ?? form.mapId;
            form.x = props.initialPoint.x ?? form.x;
            form.y = props.initialPoint.y ?? form.y;
          }
        }
      }
    }
  );

  watch(
    () => props.defaultMapId,
    (newVal) => {
      if (newVal && !props.isEdit) {
        form.mapId = newVal;
      }
    }
  );
</script>
