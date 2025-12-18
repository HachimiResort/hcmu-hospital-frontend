<template>
  <a-modal
    :visible="visible"
    :title="
      isEdit
        ? $t('mapPage.modal.editMapTitle')
        : $t('mapPage.modal.createMapTitle')
    "
    :mask-closable="false"
    @cancel="handleCancel"
    @before-ok="handleOk"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item field="mapName" :label="$t('mapPage.modal.form.mapName')">
        <a-input
          v-model="form.mapName"
          :placeholder="$t('mapPage.modal.form.mapName.placeholder')"
        />
      </a-form-item>

      <a-form-item field="imageBase64" :label="$t('mapPage.modal.form.image')">
        <a-textarea
          v-model="form.imageBase64"
          :placeholder="$t('mapPage.modal.form.image.placeholder')"
          :auto-size="{ minRows: 4, maxRows: 8 }"
        />
        <div class="upload-row">
          <a-upload
            :max-count="1"
            :show-file-list="false"
            :on-before-upload="handleBeforeUpload"
          >
            <a-button type="primary">
              <template #icon>
                <icon-upload />
              </template>
              {{ $t('mapPage.modal.form.image.upload') }}
            </a-button>
          </a-upload>
        </div>
        <div v-if="previewSrc" class="image-preview">
          <img :src="previewSrc" alt="map preview" />
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import {
    createMap,
    getMapById,
    updateMap,
    MapCreateDTO,
    MapUpdateDTO,
    MapListDTO,
  } from '@/api/map';

  const props = defineProps<{
    visible: boolean;
    isEdit: boolean;
    mapId?: number;
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'success', map?: MapListDTO): void;
  }>();

  const { t } = useI18n();
  const formRef = ref<FormInstance>();

  const form = reactive<MapCreateDTO>({
    mapName: '',
    imageBase64: '',
  });

  const rules = {
    mapName: [
      { required: true, message: t('mapPage.modal.form.mapName.required') },
    ],
    imageBase64: [
      { required: true, message: t('mapPage.modal.form.image.required') },
    ],
  };

  const normalizeImageBase64 = (value: string) => {
    if (!value) return value;
    if (value.startsWith('data:image')) {
      const parts = value.split(',');
      return parts.length > 1 ? parts[1] : value;
    }
    return value;
  };

  const getPreviewSrc = (value: string) => {
    if (!value) return '';
    if (value.startsWith('data:image')) {
      return value;
    }
    return `data:image/png;base64,${value}`;
  };

  const previewSrc = computed(() => getPreviewSrc(form.imageBase64));

  const resetForm = () => {
    form.mapName = '';
    form.imageBase64 = '';
    formRef.value?.clearValidate();
  };

  const handleCancel = () => {
    resetForm();
    emit('cancel');
  };

  const fetchMapDetail = async (mapId: number) => {
    try {
      const { data } = await getMapById(mapId);
      form.mapName = data.mapName;
      form.imageBase64 = data.imageBase64 || '';
    } catch (err) {
      Message.error(t('mapPage.message.fetchMapsError'));
    }
  };

  const handleOk = async () => {
    const valid = await formRef.value?.validate();
    if (valid) {
      return false;
    }

    try {
      if (props.isEdit && props.mapId) {
        const payload: MapUpdateDTO = {
          mapName: form.mapName.trim(),
          imageBase64: normalizeImageBase64(form.imageBase64),
        };
        await updateMap(props.mapId, payload);
        Message.success(t('mapPage.message.updateMapSuccess'));
        emit('success');
      } else {
        const payload: MapCreateDTO = {
          mapName: form.mapName.trim(),
          imageBase64: normalizeImageBase64(form.imageBase64),
        };
        const { data } = await createMap(payload);
        Message.success(t('mapPage.message.createMapSuccess'));
        emit('success', data);
      }
      resetForm();
      return true;
    } catch (err) {
      Message.error(
        props.isEdit
          ? t('mapPage.message.updateMapError')
          : t('mapPage.message.createMapError')
      );
      return false;
    }
  };

  const handleBeforeUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      Message.error(t('mapPage.message.imageTypeError'));
      return false;
    }
    const reader = new FileReader();
    reader.onload = () => {
      form.imageBase64 = String(reader.result || '');
    };
    reader.readAsDataURL(file);
    return false;
  };

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        if (props.isEdit && props.mapId) {
          fetchMapDetail(props.mapId);
        } else {
          resetForm();
        }
      }
    }
  );
</script>

<style lang="less" scoped>
  .upload-row {
    margin-top: 12px;
  }

  .image-preview {
    margin-top: 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 8px;
    background-color: var(--color-bg-1);
    img {
      width: 100%;
      max-height: 240px;
      object-fit: contain;
      display: block;
    }
  }
</style>
