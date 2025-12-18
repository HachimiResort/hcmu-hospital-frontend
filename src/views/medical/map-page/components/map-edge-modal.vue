<template>
  <a-modal
    :visible="visible"
    :title="
      isEdit
        ? $t('mapPage.modal.editEdgeTitle')
        : $t('mapPage.modal.createEdgeTitle')
    "
    :mask-closable="false"
    @cancel="handleCancel"
    @before-ok="handleOk"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item
        field="fromPointId"
        :label="$t('mapPage.modal.form.fromPoint')"
      >
        <a-select
          v-model="form.fromPointId"
          :placeholder="$t('mapPage.modal.form.fromPoint.placeholder')"
          :options="pointOptions"
        />
      </a-form-item>

      <a-form-item field="toPointId" :label="$t('mapPage.modal.form.toPoint')">
        <a-select
          v-model="form.toPointId"
          :placeholder="$t('mapPage.modal.form.toPoint.placeholder')"
          :options="pointOptions"
        />
      </a-form-item>

      <a-form-item field="distance" :label="$t('mapPage.modal.form.distance')">
        <a-input-number
          v-model="form.distance"
          :placeholder="$t('mapPage.modal.form.distance.placeholder')"
          :min="0"
          :step="0.1"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import {
    createMapEdge,
    getMapEdgeById,
    updateMapEdge,
    MapEdgeCreateDTO,
    MapEdgeUpdateDTO,
  } from '@/api/map';

  const props = defineProps<{
    visible: boolean;
    isEdit: boolean;
    edgeId?: number;
    pointOptions: Array<{ label: string; value: number }>;
    initialEdge?: { fromPointId?: number; toPointId?: number };
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'success'): void;
  }>();

  const { t } = useI18n();
  const formRef = ref<FormInstance>();

  const form = reactive({
    fromPointId: undefined as number | undefined,
    toPointId: undefined as number | undefined,
    distance: undefined as number | undefined,
  });

  const rules = {
    fromPointId: [
      { required: true, message: t('mapPage.modal.form.fromPoint.required') },
    ],
    toPointId: [
      { required: true, message: t('mapPage.modal.form.toPoint.required') },
    ],
    distance: [
      { required: true, message: t('mapPage.modal.form.distance.required') },
    ],
  };

  const resetForm = () => {
    form.fromPointId = undefined;
    form.toPointId = undefined;
    form.distance = undefined;
    formRef.value?.clearValidate();
  };

  const handleCancel = () => {
    resetForm();
    emit('cancel');
  };

  const fetchDetail = async (edgeId: number) => {
    try {
      const { data } = await getMapEdgeById(edgeId);
      form.fromPointId = data.fromPointId;
      form.toPointId = data.toPointId;
      form.distance = data.distance;
    } catch (err) {
      Message.error(t('mapPage.message.fetchEdgesError'));
    }
  };

  const handleOk = async () => {
    const valid = await formRef.value?.validate();
    if (valid) {
      return false;
    }

    try {
      if (props.isEdit && props.edgeId) {
        const payload: MapEdgeUpdateDTO = {
          fromPointId: form.fromPointId as number,
          toPointId: form.toPointId as number,
          distance: form.distance as number,
        };
        await updateMapEdge(props.edgeId, payload);
        Message.success(t('mapPage.message.updateEdgeSuccess'));
      } else {
        const payload: MapEdgeCreateDTO = {
          fromPointId: form.fromPointId as number,
          toPointId: form.toPointId as number,
          distance: form.distance as number,
        };
        await createMapEdge(payload);
        Message.success(t('mapPage.message.createEdgeSuccess'));
      }
      resetForm();
      emit('success');
      return true;
    } catch (err) {
      Message.error(
        props.isEdit
          ? t('mapPage.message.updateEdgeError')
          : t('mapPage.message.createEdgeError')
      );
      return false;
    }
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        if (props.isEdit && props.edgeId) {
          fetchDetail(props.edgeId);
        } else {
          resetForm();
          if (props.initialEdge) {
            form.fromPointId = props.initialEdge.fromPointId;
            form.toPointId = props.initialEdge.toPointId;
          }
        }
      }
    }
  );
</script>
