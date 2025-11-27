<template>
  <a-modal
    :visible="visible"
    :title="$t('schedulePage.importModal.title')"
    :mask-closable="false"
    width="1200px"
    :footer="false"
    @cancel="handleCancel"
  >
    <div class="import-modal-content">
      <div class="import-layout">
        <!-- 左侧模板列表 -->
        <div class="import-left">
          <div class="template-header">
            <a-input-search
              v-model="templateSearch"
              :placeholder="$t('schedulePage.importModal.searchPlaceholder')"
              allow-clear
              @search="fetchTemplates"
              @press-enter="fetchTemplates"
            />
          </div>

          <a-spin :loading="templateLoading" style="width: 100%">
            <div v-if="templateList.length === 0" class="empty-holder">
              <a-empty
                :description="$t('schedulePage.importModal.noTemplates')"
              />
            </div>
            <div v-else class="template-list">
              <div
                v-for="template in templateList"
                :key="template.templateId"
                class="template-item"
                :class="{ active: template.templateId === selectedTemplateId }"
                @click="handleSelectTemplate(template.templateId)"
              >
                <div class="template-name">{{ template.templateName }}</div>
                <div class="template-meta">
                  <span class="meta-tag">
                    <icon-clock-circle />
                    {{ formatDate(template.updateTime) }}
                  </span>
                </div>
              </div>
            </div>
          </a-spin>
        </div>

        <!-- 右侧模板预览 -->
        <div class="import-right">
          <a-spin :loading="scheduleLoading" style="width: 100%; height: 100%">
            <a-empty
              v-if="!selectedTemplateId"
              :description="$t('schedulePage.importModal.selectTemplateFirst')"
              style="margin-top: 60px"
            />
            <div v-else class="preview-container">
              <div class="preview-header">
                <span class="preview-title">{{
                  $t('schedulePage.importModal.preview')
                }}</span>
                <span class="template-name">{{ selectedTemplateName }}</span>
              </div>

              <!-- 缩略图日历 -->
              <div class="calendar-thumbnail">
                <div class="calendar-header-row">
                  <div class="time-cell header-cell">
                    {{ $t('schedulePage.importModal.period') }}
                  </div>
                  <div
                    v-for="day in weekDays"
                    :key="day.value"
                    class="day-cell header-cell"
                  >
                    {{ day.label }}
                  </div>
                </div>

                <div
                  v-for="period in timePeriods"
                  :key="period.value"
                  class="calendar-row"
                >
                  <div class="time-cell">{{ period.shortLabel }}</div>
                  <div
                    v-for="day in weekDays"
                    :key="`${day.value}-${period.value}`"
                    class="schedule-cell"
                  >
                    <template v-if="getSchedule(day.value, period.value)">
                      <div
                        class="schedule-item"
                        :class="
                          `schedule-type-${getSchedule(day.value, period.value)!.slotType}`
                        "
                      >
                        <div class="schedule-type">
                          {{
                            getSlotTypeText(
                              getSchedule(day.value, period.value)!.slotType
                            )
                          }}
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- 导入表单 -->
              <div class="import-form">
                <a-form :model="importForm" layout="vertical">
                  <a-form-item
                    field="targetWeek"
                    :label="$t('schedulePage.importModal.form.targetWeek')"
                    :rules="[
                      {
                        required: true,
                        message: $t(
                          'schedulePage.importModal.form.targetWeek.required'
                        ),
                      },
                    ]"
                  >
                    <a-week-picker
                      v-model="importForm.targetWeek"
                      :placeholder="
                        $t(
                          'schedulePage.importModal.form.targetWeek.placeholder'
                        )
                      "
                      :day-start-of-week="1"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-form>

                <a-alert type="info" style="margin-bottom: 16px">
                  {{ $t('schedulePage.importModal.tips') }}
                </a-alert>

                <a-space>
                  <a-button @click="handleCancel">
                    {{ $t('common.cancel') }}
                  </a-button>
                  <a-button
                    type="primary"
                    :loading="importing"
                    :disabled="!selectedTemplateId || !importForm.targetWeek"
                    @click="handleImport"
                  >
                    {{ $t('schedulePage.importModal.button.import') }}
                  </a-button>
                </a-space>
              </div>
            </div>
          </a-spin>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  /* eslint-disable no-use-before-define */
  import { ref, reactive, watch, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import {
    getAllTemplates,
    getTemplateSchedules,
    TemplateListDTO,
    TemplateScheduleListDTO,
  } from '@/api/schedule-template';
  import { importScheduleFromTemplate } from '@/api/doctor-profile';

  const props = defineProps<{
    visible: boolean;
    userId: number;
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'success'): void;
  }>();

  const { t } = useI18n();

  const templateList = ref<TemplateListDTO[]>([]);
  const templateLoading = ref(false);
  const templateSearch = ref('');

  const selectedTemplateId = ref<number | null>(null);
  const scheduleList = ref<TemplateScheduleListDTO[]>([]);
  const scheduleLoading = ref(false);

  const importForm = reactive({
    targetWeek: '',
  });

  const importing = ref(false);

  const weekDays = computed(() => [
    { value: 1, label: t('schedulePage.importModal.weekday.mon') },
    { value: 2, label: t('schedulePage.importModal.weekday.tue') },
    { value: 3, label: t('schedulePage.importModal.weekday.wed') },
    { value: 4, label: t('schedulePage.importModal.weekday.thu') },
    { value: 5, label: t('schedulePage.importModal.weekday.fri') },
    { value: 6, label: t('schedulePage.importModal.weekday.sat') },
    { value: 7, label: t('schedulePage.importModal.weekday.sun') },
  ]);

  const slotTypeOptions = computed(() => [
    { value: 1, label: t('schedulePage.importModal.slotType.normal') },
    { value: 2, label: t('schedulePage.importModal.slotType.expert') },
    { value: 3, label: t('schedulePage.importModal.slotType.special') },
  ]);

  const getPeriodText = (period: number) => {
    const slotPeriodMap: Record<number, { full: string; short: string }> = {
      1: { full: '上午8:00-8:30', short: '8:00' },
      2: { full: '上午8:30-9:00', short: '8:30' },
      3: { full: '上午9:00-9:30', short: '9:00' },
      4: { full: '上午9:30-10:00', short: '9:30' },
      5: { full: '上午10:00-10:30', short: '10:00' },
      6: { full: '上午10:30-11:00', short: '10:30' },
      7: { full: '下午13:30-14:00', short: '13:30' },
      8: { full: '下午14:00-14:30', short: '14:00' },
      9: { full: '下午14:30-15:00', short: '14:30' },
      10: { full: '下午15:00-15:30', short: '15:00' },
      11: { full: '下午15:30-16:00', short: '15:30' },
      12: { full: '下午16:00-16:30', short: '16:00' },
    };
    return slotPeriodMap[period] || { full: `#${period}`, short: `#${period}` };
  };

  const timePeriods = computed(() =>
    Array.from({ length: 12 }, (_, index) => {
      const value = index + 1;
      const text = getPeriodText(value);
      return {
        value,
        label: text.full,
        shortLabel: text.short,
      };
    })
  );

  const selectedTemplateName = computed(() => {
    const template = templateList.value.find(
      (tmpl) => tmpl.templateId === selectedTemplateId.value
    );
    return template?.templateName || '';
  });

  const formatDate = (val?: string) => {
    if (!val) return '-';
    return dayjs(val).format('YYYY-MM-DD HH:mm');
  };

  const getSlotTypeText = (slotType: number) => {
    const found = slotTypeOptions.value.find((item) => item.value === slotType);
    return found?.label || `#${slotType}`;
  };

  const getSchedule = (weekday: number, slotPeriod: number) =>
    scheduleList.value.find(
      (item) =>
        Number(item.weekday) === Number(weekday) &&
        item.slotPeriod === slotPeriod
    );

  const fetchTemplates = async () => {
    try {
      templateLoading.value = true;
      const { data } = await getAllTemplates({
        pageNum: 1,
        pageSize: 50,
        templateName: templateSearch.value,
      });

      const list = (data && (data as any).list) || [];
      templateList.value = list;

      if (list.length > 0 && !selectedTemplateId.value) {
        selectedTemplateId.value = list[0].templateId;
        await fetchSchedules(list[0].templateId);
      }
    } catch (error) {
      Message.error(t('schedulePage.importModal.message.fetchError'));
    } finally {
      templateLoading.value = false;
    }
  };

  const fetchSchedules = async (templateId: number) => {
    try {
      scheduleLoading.value = true;
      const { data } = await getTemplateSchedules(templateId, {
        pageNum: 1,
        pageSize: 200,
      });
      const list = (data && (data as any).list) || [];
      scheduleList.value = list;
    } catch (error) {
      Message.error(t('schedulePage.importModal.message.fetchError'));
    } finally {
      scheduleLoading.value = false;
    }
  };

  const handleSelectTemplate = (templateId: number) => {
    if (selectedTemplateId.value === templateId) return;
    selectedTemplateId.value = templateId;
    fetchSchedules(templateId);
  };

  const resetForm = () => {
    selectedTemplateId.value = null;
    scheduleList.value = [];
    importForm.targetWeek = '';
    templateSearch.value = '';
  };

  const handleCancel = () => {
    resetForm();
    emit('cancel');
  };

  const handleImport = async () => {
    if (!selectedTemplateId.value || !importForm.targetWeek) {
      Message.warning(t('schedulePage.importModal.message.requiredField'));
      return;
    }

    try {
      importing.value = true;
      await importScheduleFromTemplate(props.userId, {
        templateId: selectedTemplateId.value,
        scheduleDate: dayjs(importForm.targetWeek).format('YYYY-MM-DD'),
      });
      Message.success(t('schedulePage.importModal.message.importSuccess'));
      resetForm();
      emit('success');
    } catch (err: any) {
      Message.error(
        err.response?.data?.msg ||
          t('schedulePage.importModal.message.importError')
      );
    } finally {
      importing.value = false;
    }
  };

  // 监听弹窗打开
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        fetchTemplates();
      } else {
        resetForm();
      }
    }
  );
</script>

<style scoped lang="less">
  .import-modal-content {
    .import-layout {
      display: flex;
      gap: 20px;
      height: 600px;
    }

    .import-left {
      flex: 0 0 280px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-right: 1px solid var(--color-border-2);
      padding-right: 20px;

      .template-header {
        flex-shrink: 0;
      }

      .template-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .template-item {
          border: 1px solid var(--color-border-2);
          border-radius: 6px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: var(--color-fill-1);

          &:hover {
            border-color: rgb(var(--primary-6));
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          &.active {
            border-color: rgb(var(--primary-6));
            background-color: rgb(var(--primary-1));
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          }

          .template-name {
            font-weight: 600;
            color: var(--color-text-1);
            font-size: 14px;
            margin-bottom: 6px;
          }

          .template-meta {
            display: flex;
            font-size: 12px;
            color: var(--color-text-3);

            .meta-tag {
              display: inline-flex;
              align-items: center;
              gap: 4px;

              svg {
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .import-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .preview-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--color-border-2);

          .preview-title {
            color: var(--color-text-3);
            font-size: 14px;
          }

          .template-name {
            font-weight: 600;
            color: var(--color-text-1);
            font-size: 15px;
          }
        }

        .calendar-thumbnail {
          flex: 1;
          overflow: auto;
          border: 1px solid var(--color-border-2);
          border-radius: 8px;
          background-color: var(--color-fill-1);

          .calendar-header-row,
          .calendar-row {
            display: grid;
            grid-template-columns: 60px repeat(7, minmax(50px, 1fr));
          }

          .header-cell {
            background-color: var(--color-fill-2);
            font-weight: 600;
            color: var(--color-text-2);
            border-bottom: 1px solid var(--color-border-2);
            border-right: 1px solid var(--color-border-2);
            padding: 6px 4px;
            text-align: center;
            font-size: 12px;
          }

          .day-cell:last-child,
          .schedule-cell:last-child {
            border-right: none;
          }

          .time-cell {
            border-right: 1px solid var(--color-border-2);
            border-bottom: 1px solid var(--color-border-2);
            background-color: var(--color-fill-2);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            font-size: 11px;
            font-weight: 600;
            color: var(--color-text-1);
          }

          .schedule-cell {
            min-height: 40px;
            border-right: 1px solid var(--color-border-2);
            border-bottom: 1px solid var(--color-border-2);
            background-color: var(--color-bg-2);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px;

            .schedule-item {
              width: 100%;
              height: 100%;
              border-radius: 4px;
              padding: 4px;
              display: flex;
              align-items: center;
              justify-content: center;

              .schedule-type {
                font-weight: 600;
                font-size: 11px;
              }

              &.schedule-type-1 {
                background-color: rgb(var(--blue-1));
                border: 1px solid rgb(var(--blue-3));
                color: rgb(var(--blue-8));
              }

              &.schedule-type-2 {
                background-color: rgb(var(--green-1));
                border: 1px solid rgb(var(--green-3));
                color: rgb(var(--green-8));
              }

              &.schedule-type-3 {
                background-color: rgb(var(--orange-1));
                border: 1px solid rgb(var(--orange-3));
                color: rgb(var(--orange-8));
              }
            }
          }
        }

        .import-form {
          flex-shrink: 0;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-2);
        }
      }
    }

    .empty-holder {
      padding: 32px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
