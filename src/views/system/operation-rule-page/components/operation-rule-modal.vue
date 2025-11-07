<template>
  <a-modal
    :visible="visible"
    :title="$t('operationRulePage.modal.editTitle')"
    :mask-closable="false"
    @cancel="handleCancel"
    @before-ok="handleOk"
  >
    <a-form ref="formRef" :model="form" layout="vertical">
      <a-form-item
        field="value"
        :label="$t('operationRulePage.modal.form.value')"
      >
        <a-input-number
          v-model="form.value"
          :min="rule?.minValue"
          :max="rule?.maxValue"
          :placeholder="$t('operationRulePage.modal.form.value.placeholder')"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        field="enabled"
        :label="$t('operationRulePage.modal.form.enabled')"
      >
        <a-switch v-model="switchEnabled" />
      </a-form-item>
      <a-alert
        type="info"
        show-icon
        :content="rangeTip"
        style="margin-top: 4px"
      />
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import {
    updateOperationRule,
    OperationRuleListDTO,
  } from '@/api/operation-rule';

  const props = defineProps<{
    visible: boolean;
    rule?: OperationRuleListDTO;
  }>();
  const emit = defineEmits<{ (e: 'cancel'): void; (e: 'success'): void }>();

  const { t } = useI18n();
  const formRef = ref<FormInstance>();

  const form = ref<{ value: number | undefined }>({ value: undefined });
  const switchEnabled = ref<boolean>(false);

  const rangeTip = computed(() => {
    if (!props.rule) return '';
    return t('operationRulePage.modal.tips.range', {
      min: props.rule.minValue,
      max: props.rule.maxValue,
      def: props.rule.defaultValue,
    });
  });

  // 监听弹窗打开填充数据
  watch(
    () => props.visible,
    (v) => {
      if (v && props.rule) {
        form.value.value = props.rule.value;
        switchEnabled.value = props.rule.enabled === 1;
        formRef.value?.clearValidate?.();
      }
    }
  );

  const handleCancel = () => {
    emit('cancel');
  };

  const handleOk = async () => {
    if (!props.rule) return false;

    const newValue = form.value.value;
    if (newValue !== undefined) {
      if (props.rule.minValue !== undefined && newValue < props.rule.minValue) {
        Message.error(
          t('operationRulePage.modal.tips.range', {
            min: props.rule.minValue,
            max: props.rule.maxValue,
            def: props.rule.defaultValue,
          })
        );
        return false;
      }
      if (props.rule.maxValue !== undefined && newValue > props.rule.maxValue) {
        Message.error(
          t('operationRulePage.modal.tips.range', {
            min: props.rule.minValue,
            max: props.rule.maxValue,
            def: props.rule.defaultValue,
          })
        );
        return false;
      }
    }

    try {
      await updateOperationRule(props.rule.code, {
        value: newValue,
        enabled: switchEnabled.value ? 1 : 0,
      });
      Message.success(t('operationRulePage.message.updateSuccess'));
      emit('success');
      return true;
    } catch (err) {
      Message.error(t('operationRulePage.message.updateError'));
      return false;
    }
  };
</script>
