<template>
  <div class="schedule-template-page">
    <Breadcrumb
      :items="['menu.medical', 'menu.medical.scheduleTemplatePage']"
    />

    <div class="layout">
      <div class="layout-left">
        <a-card
          :bordered="false"
          class="template-card"
          :title="$t('scheduleTemplatePage.templates')"
        >
          <template #extra>
            <a-space>
              <a-button size="small" type="outline" @click="fetchTemplates">
                <template #icon>
                  <icon-refresh />
                </template>
              </a-button>
              <a-button
                size="small"
                type="primary"
                @click="openTemplateModal()"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('scheduleTemplatePage.createTemplate') }}
              </a-button>
            </a-space>
          </template>

          <a-input-search
            v-model="templateSearch"
            :placeholder="$t('scheduleTemplatePage.searchPlaceholder')"
            allow-clear
            class="template-search"
            @search="fetchTemplates"
            @press-enter="fetchTemplates"
          />

          <a-spin :loading="templateLoading">
            <div v-if="templateList.length === 0" class="empty-holder">
              <a-empty :description="$t('scheduleTemplatePage.noTemplates')" />
            </div>
            <div v-else class="template-list">
              <div
                v-for="template in templateList"
                :key="template.templateId"
                class="template-item"
                :class="{ active: template.templateId === selectedTemplateId }"
                @click="handleSelectTemplate(template.templateId)"
              >
                <div class="template-title-row">
                  <div class="template-name">{{ template.templateName }}</div>
                  <a-dropdown
                    trigger="click"
                    @select="
                      (val) => handleTemplateAction(String(val), template)
                    "
                  >
                    <a-button
                      type="text"
                      size="mini"
                      class="template-more"
                      @click.stop
                    >
                      <icon-more />
                    </a-button>
                    <template #content>
                      <a-doption value="edit">
                        {{ $t('scheduleTemplatePage.actions.edit') }}
                      </a-doption>
                      <a-doption value="delete">
                        {{ $t('scheduleTemplatePage.actions.delete') }}
                      </a-doption>
                    </template>
                  </a-dropdown>
                </div>
                <div class="template-meta">
                  <span class="meta-tag">
                    <icon-clock-circle />
                    {{ formatDate(template.updateTime) }}
                  </span>
                  <span class="meta-tag meta-count">
                    <icon-calendar />
                    <span v-if="selectedTemplateId === template.templateId">
                      {{ scheduleList.length }}
                      {{ $t('scheduleTemplatePage.itemsSuffix') }}
                    </span>
                    <span v-else>
                      {{ $t('scheduleTemplatePage.viewScheduleHint') }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </a-spin>
        </a-card>
      </div>

      <div class="layout-right">
        <a-card
          class="template-calendar"
          :bordered="false"
          :body-style="{ padding: '20px' }"
        >
          <template #title>
            <div class="calendar-header">
              <div class="template-info">
                <span class="template-label"
                  >{{ $t('scheduleTemplatePage.title') }}:</span
                >
                <span class="template-name">{{ selectedTemplateTitle }}</span>
              </div>
              <a-space>
                <a-button
                  size="small"
                  :disabled="!selectedTemplateId"
                  @click="handleRefreshSchedules"
                >
                  <template #icon>
                    <icon-refresh />
                  </template>
                </a-button>
                <a-button
                  size="small"
                  type="primary"
                  :disabled="!selectedTemplateId"
                  @click="openScheduleModal()"
                >
                  <template #icon>
                    <icon-plus />
                  </template>
                  {{ $t('scheduleTemplatePage.addSchedule') }}
                </a-button>
              </a-space>
            </div>
          </template>

          <a-spin :loading="scheduleLoading" style="width: 100%">
            <a-empty
              v-if="!selectedTemplateId"
              :description="$t('scheduleTemplatePage.selectTemplateFirst')"
            />
            <div v-else class="calendar-grid">
              <div class="calendar-header-row">
                <div class="time-cell header-cell">
                  {{ $t('scheduleTemplatePage.scheduleForm.slotPeriod') }}
                </div>
                <div
                  v-for="day in weekDays"
                  :key="day.value"
                  class="day-cell header-cell"
                >
                  <div class="day-name">{{ day.label }}</div>
                </div>
              </div>

              <div
                v-for="period in timePeriods"
                :key="period.value"
                class="calendar-row"
              >
                <div class="time-cell">
                  <div class="time-label">{{ period.label }}</div>
                </div>
                <div
                  v-for="day in weekDays"
                  :key="`${day.value}-${period.value}`"
                  class="schedule-cell"
                  @click="handleCellClick(day.value, period.value)"
                >
                  <template v-if="getSchedule(day.value, period.value)">
                    <div
                      class="schedule-item"
                      :class="`schedule-type-${getSchedule(day.value, period.value)!.slotType}`"
                    >
                      <div class="schedule-type">
                        {{
                          getSlotTypeText(
                            getSchedule(day.value, period.value)!.slotType
                          )
                        }}
                      </div>
                      <div class="schedule-info">
                        <span
                          >{{ $t('scheduleTemplatePage.slots') }}:
                          {{
                            getSchedule(day.value, period.value)!.totalSlots
                          }}</span
                        >
                        <span
                          >¥{{
                            getSchedule(day.value, period.value)!.fee
                          }}</span
                        >
                      </div>
                      <div class="schedule-actions">
                        <a-button
                          type="text"
                          size="mini"
                          @click.stop="
                            handleScheduleAction(
                              'edit',
                              getSchedule(day.value, period.value)!
                            )
                          "
                        >
                          <icon-edit />
                        </a-button>
                        <a-button
                          type="text"
                          size="mini"
                          status="danger"
                          @click.stop="
                            handleScheduleAction(
                              'delete',
                              getSchedule(day.value, period.value)!
                            )
                          "
                        >
                          <icon-delete />
                        </a-button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="empty-cell">
                      <icon-plus />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </a-spin>
        </a-card>
      </div>
    </div>

    <!-- 模板弹窗 -->
    <a-modal
      v-model:visible="templateModalVisible"
      :title="templateModalTitle"
      :ok-loading="templateSaving"
      width="480px"
      @ok="handleSaveTemplate"
    >
      <a-form :model="templateForm" layout="vertical">
        <a-form-item
          field="templateName"
          :label="$t('scheduleTemplatePage.templateName')"
          :rules="[
            {
              required: true,
              message: $t('scheduleTemplatePage.templateNameRequired'),
            },
          ]"
        >
          <a-input
            v-model="templateForm.templateName"
            :placeholder="$t('scheduleTemplatePage.templateNamePlaceholder')"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 排班弹窗 -->
    <a-modal
      v-model:visible="scheduleModalVisible"
      :title="scheduleModalTitle"
      :ok-loading="scheduleSaving"
      width="520px"
      @ok="handleSaveSchedule"
    >
      <a-form :model="scheduleForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="slotType"
              :label="$t('scheduleTemplatePage.scheduleForm.slotType')"
              :rules="[
                {
                  required: true,
                  message: $t('scheduleTemplatePage.message.requiredField'),
                },
              ]"
            >
              <a-select
                v-model="scheduleForm.slotType"
                :placeholder="
                  $t('scheduleTemplatePage.scheduleForm.slotTypePlaceholder')
                "
              >
                <a-option
                  v-for="option in slotTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              field="slotPeriod"
              :label="$t('scheduleTemplatePage.scheduleForm.slotPeriod')"
              :rules="[
                {
                  required: true,
                  message: $t('scheduleTemplatePage.message.requiredField'),
                },
              ]"
            >
              <a-select
                v-model="scheduleForm.slotPeriod"
                :placeholder="
                  $t('scheduleTemplatePage.scheduleForm.slotPeriodPlaceholder')
                "
              >
                <a-option
                  v-for="option in periodOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="totalSlots"
              :label="$t('scheduleTemplatePage.scheduleForm.totalSlots')"
              :rules="[
                {
                  required: true,
                  message: $t('scheduleTemplatePage.message.requiredField'),
                },
              ]"
            >
              <a-input-number
                v-model="scheduleForm.totalSlots"
                :min="1"
                :placeholder="
                  $t('scheduleTemplatePage.scheduleForm.totalSlotsPlaceholder')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              field="fee"
              :label="$t('scheduleTemplatePage.scheduleForm.fee')"
              :rules="[
                {
                  required: true,
                  message: $t('scheduleTemplatePage.message.requiredField'),
                },
              ]"
            >
              <a-input-number
                v-model="scheduleForm.fee"
                :min="0"
                :formatter="(value: number | string | undefined) => `${value ?? ''}`"
                :placeholder="
                  $t('scheduleTemplatePage.scheduleForm.feePlaceholder')
                "
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          field="weekday"
          :label="$t('scheduleTemplatePage.scheduleForm.weekday')"
          :rules="[
            {
              required: true,
              message: $t('scheduleTemplatePage.message.requiredField'),
            },
          ]"
        >
          <a-select
            v-model="scheduleForm.weekday"
            :placeholder="
              $t('scheduleTemplatePage.scheduleForm.weekdayPlaceholder')
            "
          >
            <a-option
              v-for="weekday in weekdayOptions"
              :key="weekday.value"
              :label="weekday.label"
              :value="weekday.value"
            />
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, Modal } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import {
    createTemplate,
    createTemplateSchedule,
    deleteTemplate,
    deleteTemplateSchedule,
    getAllTemplates,
    getTemplateSchedules,
    TemplateListDTO,
    TemplateScheduleListDTO,
    updateTemplate,
    updateTemplateSchedule,
  } from '@/api/schedule-template';

  const { t } = useI18n();

  const templateList = ref<TemplateListDTO[]>([]);
  const templateLoading = ref(false);
  const templateSaving = ref(false);
  const templateSearch = ref('');

  const selectedTemplateId = ref<number | null>(null);

  const scheduleList = ref<TemplateScheduleListDTO[]>([]);
  const scheduleLoading = ref(false);
  const scheduleSaving = ref(false);

  const templateModalVisible = ref(false);
  const templateForm = reactive({ templateName: '' });
  const editingTemplateId = ref<number | null>(null);

  const scheduleModalVisible = ref(false);
  const editingScheduleId = ref<number | null>(null);
  const scheduleForm = reactive({
    slotType: 1,
    slotPeriod: 1,
    totalSlots: 10,
    fee: 0,
    weekday: 1,
  });

  const weekdayOptions = computed(() => [
    { value: 1, label: t('scheduleTemplatePage.weekday.mon') },
    { value: 2, label: t('scheduleTemplatePage.weekday.tue') },
    { value: 3, label: t('scheduleTemplatePage.weekday.wed') },
    { value: 4, label: t('scheduleTemplatePage.weekday.thu') },
    { value: 5, label: t('scheduleTemplatePage.weekday.fri') },
    { value: 6, label: t('scheduleTemplatePage.weekday.sat') },
    { value: 7, label: t('scheduleTemplatePage.weekday.sun') },
  ]);

  const slotTypeOptions = computed(() => [
    { value: 1, label: t('scheduleTemplatePage.slotType.normal') },
    { value: 2, label: t('scheduleTemplatePage.slotType.expert') },
    { value: 3, label: t('scheduleTemplatePage.slotType.special') },
  ]);

  const getPeriodText = (period: number) => {
    const slotPeriodMap: Record<number, string> = {
      1: '上午8:00-8:30',
      2: '上午8:30-9:00',
      3: '上午9:00-9:30',
      4: '上午9:30-10:00',
      5: '上午10:00-10:30',
      6: '上午10:30-11:00',
      7: '下午13:30-14:00',
      8: '下午14:00-14:30',
      9: '下午14:30-15:00',
      10: '下午15:00-15:30',
      11: '下午15:30-16:00',
      12: '下午16:00-16:30',
    };
    return slotPeriodMap[period] || `#${period}`;
  };

  const periodOptions = computed(() =>
    Array.from({ length: 12 }, (_, index) => {
      const value = index + 1;
      return {
        value,
        label: getPeriodText(value),
      };
    })
  );

  const selectedTemplate = computed(() =>
    templateList.value.find(
      (item) => item.templateId === selectedTemplateId.value
    )
  );

  const selectedTemplateTitle = computed(
    () =>
      selectedTemplate.value?.templateName ||
      t('scheduleTemplatePage.selectTemplateFirst')
  );

  const templateModalTitle = computed(() =>
    editingTemplateId.value
      ? t('scheduleTemplatePage.editTemplate')
      : t('scheduleTemplatePage.createTemplate')
  );

  const scheduleModalTitle = computed(() =>
    editingScheduleId.value
      ? t('scheduleTemplatePage.scheduleForm.titleEdit')
      : t('scheduleTemplatePage.scheduleForm.titleCreate')
  );

  const getSlotTypeText = (slotType: number) => {
    const found = slotTypeOptions.value.find((item) => item.value === slotType);
    return found?.label || `#${slotType}`;
  };

  const timePeriods = computed(() =>
    Array.from({ length: 12 }, (_item, index) => {
      const value = index + 1;
      return {
        value,
        label: getPeriodText(value),
      };
    })
  );

  const weekDays = computed(() => weekdayOptions.value);

  const formatDate = (val?: string) => {
    if (!val) return '-';
    return dayjs(val).format('YYYY-MM-DD HH:mm');
  };

  const resetTemplateForm = () => {
    templateForm.templateName = '';
  };

  const resetScheduleForm = () => {
    scheduleForm.slotType = 1;
    scheduleForm.slotPeriod = 1;
    scheduleForm.totalSlots = 10;
    scheduleForm.fee = 0;
    scheduleForm.weekday = 1;
  };

  const fetchTemplates = async () => {
    try {
      templateLoading.value = true;
      const { data } = await getAllTemplates({
        pageNum: 1,
        pageSize: 50,
        templateName: templateSearch.value,
      });

      const list = (data && (data as any).list) || [];
      const prevSelected = selectedTemplateId.value;
      templateList.value = list;

      let nextId: number | null = null;
      if (
        prevSelected &&
        list.some((item: TemplateListDTO) => item.templateId === prevSelected)
      ) {
        nextId = prevSelected;
      } else if (list.length > 0) {
        nextId = list[0].templateId;
      }

      selectedTemplateId.value = nextId;
      if (nextId) {
        await fetchSchedules(nextId);
      } else {
        scheduleList.value = [];
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('fetch templates error', error);
      Message.error(t('scheduleTemplatePage.message.fetchError'));
    } finally {
      templateLoading.value = false;
    }
  };

  const fetchSchedules = async (templateId?: number) => {
    const targetId = templateId || selectedTemplateId.value;
    if (!targetId) return;
    try {
      scheduleLoading.value = true;
      const { data } = await getTemplateSchedules(targetId, {
        pageNum: 1,
        pageSize: 200,
      });
      const list = (data && (data as any).list) || [];
      scheduleList.value = list;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('fetch schedules error', error);
      Message.error(t('scheduleTemplatePage.message.fetchError'));
    } finally {
      scheduleLoading.value = false;
    }
  };

  const handleSelectTemplate = (templateId: number) => {
    if (selectedTemplateId.value === templateId) return;
    selectedTemplateId.value = templateId;
    fetchSchedules(templateId);
  };

  const openTemplateModal = (template?: TemplateListDTO) => {
    if (template) {
      editingTemplateId.value = template.templateId;
      templateForm.templateName = template.templateName;
    } else {
      editingTemplateId.value = null;
      resetTemplateForm();
    }
    templateModalVisible.value = true;
  };

  const handleTemplateAction = (action: string, template: TemplateListDTO) => {
    if (action === 'edit') {
      openTemplateModal(template);
    }
    if (action === 'delete') {
      Modal.error({
        title: t('scheduleTemplatePage.actions.delete'),
        content: t('scheduleTemplatePage.deleteTemplateConfirm'),
        okText: t('common.confirm'),
        cancelText: t('common.cancel'),
        onOk: () => handleDeleteTemplate(template.templateId),
      });
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateForm.templateName.trim()) {
      Message.warning(t('scheduleTemplatePage.templateNameRequired'));
      return;
    }
    try {
      templateSaving.value = true;
      let newId: number | null = null;
      if (editingTemplateId.value) {
        await updateTemplate(editingTemplateId.value, {
          templateName: templateForm.templateName,
        });
        newId = editingTemplateId.value;
        Message.success(t('scheduleTemplatePage.message.updateSuccess'));
      } else {
        const { data } = await createTemplate({
          templateName: templateForm.templateName,
        });
        newId = (data as any)?.templateId || null;
        Message.success(t('scheduleTemplatePage.message.createSuccess'));
      }
      templateModalVisible.value = false;
      await fetchTemplates();
      if (newId) {
        selectedTemplateId.value = newId;
        await fetchSchedules(newId);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('save template error', error);
      Message.error(t('scheduleTemplatePage.message.fetchError'));
    } finally {
      templateSaving.value = false;
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      templateLoading.value = true;
      await deleteTemplate(templateId);
      Message.success(t('scheduleTemplatePage.message.deleteSuccess'));
      if (selectedTemplateId.value === templateId) {
        selectedTemplateId.value = null;
        scheduleList.value = [];
      }
      await fetchTemplates();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('delete template error', error);
      Message.error(t('scheduleTemplatePage.message.fetchError'));
    } finally {
      templateLoading.value = false;
    }
  };

  const openScheduleModal = (
    schedule?: TemplateScheduleListDTO,
    preset?: { weekday: number; slotPeriod: number }
  ) => {
    if (!selectedTemplateId.value) {
      Message.info(t('scheduleTemplatePage.selectTemplateFirst'));
      return;
    }
    if (schedule) {
      editingScheduleId.value = schedule.scheduleId;
      scheduleForm.slotType = schedule.slotType;
      scheduleForm.slotPeriod = schedule.slotPeriod;
      scheduleForm.totalSlots = schedule.totalSlots;
      scheduleForm.fee = Number(schedule.fee);
      scheduleForm.weekday = schedule.weekday;
    } else {
      editingScheduleId.value = null;
      resetScheduleForm();
      if (preset) {
        scheduleForm.weekday = preset.weekday;
        scheduleForm.slotPeriod = preset.slotPeriod;
      }
    }
    scheduleModalVisible.value = true;
  };

  const getSchedule = (weekday: number, slotPeriod: number) =>
    scheduleList.value.find(
      (item) =>
        Number(item.weekday) === Number(weekday) &&
        item.slotPeriod === slotPeriod
    );

  const handleCellClick = (weekday: number, slotPeriod: number) => {
    const existing = getSchedule(weekday, slotPeriod);
    if (existing) {
      openScheduleModal(existing);
      return;
    }
    openScheduleModal(undefined, { weekday, slotPeriod });
  };

  const handleScheduleAction = (
    action: string,
    schedule: TemplateScheduleListDTO
  ) => {
    if (action === 'edit') {
      openScheduleModal(schedule);
    }
    if (action === 'delete') {
      Modal.error({
        title: t('scheduleTemplatePage.actions.delete'),
        content: t('scheduleTemplatePage.deleteScheduleConfirm'),
        okText: t('common.confirm'),
        cancelText: t('common.cancel'),
        onOk: () => handleDeleteSchedule(schedule.scheduleId),
      });
    }
  };

  const handleSaveSchedule = async () => {
    if (
      !scheduleForm.slotType ||
      !scheduleForm.slotPeriod ||
      !scheduleForm.totalSlots ||
      scheduleForm.fee === null ||
      scheduleForm.fee === undefined ||
      !scheduleForm.weekday
    ) {
      Message.warning(t('scheduleTemplatePage.message.requiredField'));
      return;
    }
    if (!selectedTemplateId.value) return;
    try {
      scheduleSaving.value = true;
      if (editingScheduleId.value) {
        await updateTemplateSchedule(
          selectedTemplateId.value,
          editingScheduleId.value,
          {
            slotType: scheduleForm.slotType,
            slotPeriod: scheduleForm.slotPeriod,
            totalSlots: scheduleForm.totalSlots,
            fee: scheduleForm.fee,
            weekday: scheduleForm.weekday,
          }
        );
        Message.success(t('scheduleTemplatePage.message.updateSuccess'));
      } else {
        await createTemplateSchedule(selectedTemplateId.value, {
          slotType: scheduleForm.slotType,
          slotPeriod: scheduleForm.slotPeriod,
          totalSlots: scheduleForm.totalSlots,
          fee: scheduleForm.fee,
          weekday: scheduleForm.weekday,
        });
        Message.success(t('scheduleTemplatePage.message.createSuccess'));
      }
      scheduleModalVisible.value = false;
      await fetchSchedules();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('save schedule error', error);
      Message.error(t('scheduleTemplatePage.message.fetchError'));
    } finally {
      scheduleSaving.value = false;
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!selectedTemplateId.value) return;
    try {
      scheduleLoading.value = true;
      await deleteTemplateSchedule(selectedTemplateId.value, scheduleId);
      Message.success(t('scheduleTemplatePage.message.deleteSuccess'));
      await fetchSchedules();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('delete schedule error', error);
      Message.error(t('scheduleTemplatePage.message.fetchError'));
    } finally {
      scheduleLoading.value = false;
    }
  };

  const handleRefreshSchedules = () => {
    fetchSchedules();
  };

  onMounted(() => {
    fetchTemplates();
  });
</script>

<script lang="ts">
  export default {
    name: 'ScheduleTemplatePage',
  };
</script>

<style scoped lang="less">
  .schedule-template-page {
    padding: 0 20px 20px;

    .layout {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    .layout-left {
      flex: 0 0 320px;
      min-width: 280px;
    }

    .layout-right {
      flex: 1;
      min-width: 340px;
    }

    .template-card {
      height: 100%;

      :deep(.arco-card-head) {
        padding: 16px 20px;
      }

      .template-search {
        margin-bottom: 12px;
      }

      .template-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 760px;
        overflow: auto;
        padding-right: 4px;

        .template-item {
          border: 1px solid var(--color-border-2);
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: var(--color-fill-1);
          display: flex;
          flex-direction: column;
          gap: 6px;

          &:hover {
            border-color: rgb(var(--primary-6));
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }

          &.active {
            border-color: rgb(var(--primary-6));
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          }

          .template-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .template-name {
              font-weight: 600;
              color: var(--color-text-1);
              font-size: 15px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .template-more {
              color: var(--color-text-3);
            }
          }

          .template-meta {
            display: flex;
            gap: 10px;
            font-size: 12px;
            color: var(--color-text-3);
            flex-wrap: wrap;

            .meta-tag {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 8px;
              border-radius: 6px;
              background-color: var(--color-fill-2);

              svg {
                font-size: 14px;
              }
            }

            .meta-count {
              background-color: rgb(var(--primary-1));
              color: rgb(var(--primary-6));
            }
          }
        }
      }
    }

    .template-calendar {
      .calendar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        .template-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .template-label {
            color: var(--color-text-3);
          }

          .template-name {
            font-weight: 600;
            color: var(--color-text-1);
          }
        }
      }

      .calendar-grid {
        margin-top: 10px;
        border: 1px solid var(--color-border-2);
        border-radius: 10px;
        overflow: hidden;
        background-color: var(--color-fill-1);
      }

      .calendar-header-row,
      .calendar-row {
        display: grid;
        grid-template-columns: 160px repeat(7, minmax(120px, 1fr));
      }

      .header-cell {
        background-color: var(--color-fill-2);
        font-weight: 600;
        color: var(--color-text-2);
        border-bottom: 1px solid var(--color-border-2);
        border-right: 1px solid var(--color-border-2);
        padding: 12px;
        text-align: center;
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
        padding: 12px;

        .time-label {
          font-weight: 600;
          color: var(--color-text-1);
        }
      }

      .schedule-cell {
        min-height: 96px;
        border-right: 1px solid var(--color-border-2);
        border-bottom: 1px solid var(--color-border-2);
        background-color: var(--color-bg-2);
        cursor: pointer;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;

        &:hover {
          background-color: var(--color-fill-2);
        }

        .empty-cell {
          width: 100%;
          height: 100%;
          border: 1px dashed var(--color-border-2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-3);
        }

        .schedule-item {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          padding: 8px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

          .schedule-type {
            font-weight: 700;
          }

          .schedule-info {
            display: flex;
            gap: 10px;
            font-size: 12px;
            color: var(--color-text-2);
          }

          .schedule-actions {
            position: absolute;
            top: 4px;
            right: 4px;
            display: flex;
            gap: 4px;
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

    .empty-holder {
      padding: 32px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @media (max-width: 992px) {
    .schedule-template-page {
      .layout-left {
        flex: 1;
      }

      .calendar-grid {
        overflow-x: auto;
      }
    }
  }
</style>
