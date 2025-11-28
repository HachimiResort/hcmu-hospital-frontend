<template>
  <div class="approval-list">
    <a-card class="general-card" :title="$t('approvalPage.title')">
      <!-- 搜索表单 -->
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="10">
              <a-col :span="8">
                <a-form-item
                  field="requestType"
                  :label="$t('workspace.request.type')"
                >
                  <a-select
                    v-model="formModel.requestType"
                    allow-clear
                    :options="requestTypeOptions"
                    :placeholder="$t('workspace.requestList.typePlaceholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('workspace.request.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    allow-clear
                    :options="statusOptions"
                    :placeholder="$t('workspace.requestList.statusPlaceholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 86px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('listBoard.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('listBoard.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-divider style="margin-top: 0" />

      <!-- 操作按钮区域 -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space />
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <a-tooltip :content="$t('listBoard.refresh')">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('listBoard.density')">
              <div class="action-icon">
                <icon-line-height size="18" />
              </div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>

      <!-- 表格 -->
      <a-table
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        row-key="requestId"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #requestType="{ record }">
          <a-tag :color="requestTypeTagColor(record.requestType)" bordered>
            {{ getRequestTypeText(record.requestType) }}
          </a-tag>
        </template>
        <template #status="{ record }">
          <a-tag :color="statusTagColor(record.status)" bordered>
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template #doctor="{ record }">
          <div class="cell-line">
            <icon-user />
            <span>{{ record.doctorName || '-' }}</span>
          </div>
          <div class="cell-sub">ID: {{ record.doctorUserId }}</div>
        </template>
        <template #originSchedule="{ record }">
          <div class="cell-line">
            <icon-calendar />
            <span>{{ formatDate(record.scheduleDate) }}</span>
          </div>
          <div class="cell-sub">{{ getPeriodText(record.slotPeriod) }}</div>
          <div class="cell-sub">{{ getSlotTypeText(record.slotType) }}</div>
        </template>
        <template #targetSchedule="{ record }">
          <div v-if="record.requestType === 1">
            <div class="cell-line">
              <icon-swap />
              <span>{{ formatDate(record.targetDate) }}</span>
            </div>
            <div class="cell-sub">
              {{ getPeriodText(record.targetSlotPeriod) }}
              <template v-if="record.targetSlotType">
                · {{ getSlotTypeText(record.targetSlotType) }}
              </template>
            </div>
          </div>
          <div v-if="record.extraSlots" class="cell-line">
            <icon-plus />
            {{ $t('workspace.request.extraSlots') }}: {{ record.extraSlots }}
          </div>
          <div v-if="record.requestType === 2" class="cell-line">
            <icon-minus />
            {{ $t('workspace.request.leave') }}
          </div>
        </template>
        <template #reason="{ record }">
          {{ record.reason || '-' }}
        </template>
        <template #approveRemark="{ record }">
          {{ record.approveRemark || '-' }}
        </template>
        <template #createTime="{ record }">
          {{ formatDateTime(record.createTime) }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button
              v-permission="{ permissionsTarget: ['APPROVE_SCHEDULE_REQUEST'] }"
              type="text"
              size="small"
              status="success"
              :disabled="record.status !== 1"
              @click="openApprovalModal(record, 'approve')"
            >
              {{ $t('approvalPage.operation.approve') }}
            </a-button>
            <a-button
              v-permission="{ permissionsTarget: ['APPROVE_SCHEDULE_REQUEST'] }"
              type="text"
              size="small"
              status="danger"
              :disabled="record.status !== 1"
              @click="openApprovalModal(record, 'reject')"
            >
              {{ $t('approvalPage.operation.reject') }}
            </a-button>
          </a-space>
        </template>
      </a-table>

      <!-- 审批弹窗 -->
      <a-modal
        v-model:visible="approvalModalVisible"
        :title="
          actionType === 'approve'
            ? $t('approvalPage.operation.approve')
            : $t('approvalPage.operation.reject')
        "
        :ok-loading="submitLoading"
        width="480px"
        @ok="submitApproval"
        @cancel="approvalModalVisible = false"
      >
        <a-form :model="{ approveRemark }" layout="vertical">
          <a-form-item
            :label="$t('approvalPage.operation.remark')"
            :required="true"
          >
            <a-textarea
              v-model="approveRemark"
              :rows="4"
              :max-length="200"
              show-word-limit
              :placeholder="$t('approvalPage.operation.remarkPlaceholder')"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { Message, type TableColumnData } from '@arco-design/web-vue';
  import {
    getScheduleRequests,
    handleScheduleRequest,
    ScheduleRequestListDTO,
  } from '@/api/schedule-request';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const size = ref<SizeProps>('medium');
  const renderData = ref<ScheduleRequestListDTO[]>([]);
  const pagination = reactive<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const approvalModalVisible = ref(false);
  const approveRemark = ref('');
  const submitLoading = ref(false);
  const pendingRecord = ref<ScheduleRequestListDTO | null>(null);
  const actionType = ref<'approve' | 'reject'>('approve');

  const formModel = reactive({
    requestType: undefined as number | undefined,
    status: undefined as number | undefined,
  });

  const densityList = computed(() => [
    { name: t('listBoard.mini'), value: 'mini' },
    { name: t('listBoard.small'), value: 'small' },
    { name: t('listBoard.medium'), value: 'medium' },
    { name: t('listBoard.large'), value: 'large' },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('importPage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 80,
    },
    {
      title: t('approvalPage.columns.doctor'),
      dataIndex: 'doctor',
      slotName: 'doctor',
      width: 160,
    },
    {
      title: t('workspace.requestList.columns.requestType'),
      dataIndex: 'requestType',
      slotName: 'requestType',
      width: 120,
    },
    {
      title: t('workspace.requestList.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      width: 120,
    },
    {
      title: t('workspace.requestList.columns.originSchedule'),
      dataIndex: 'originSchedule',
      slotName: 'originSchedule',
      width: 200,
    },
    {
      title: t('workspace.requestList.columns.targetSchedule'),
      dataIndex: 'targetSchedule',
      slotName: 'targetSchedule',
      width: 200,
    },
    {
      title: t('workspace.requestList.columns.reason'),
      dataIndex: 'reason',
      slotName: 'reason',
      width: 200,
    },
    {
      title: t('workspace.requestList.columns.approveRemark'),
      dataIndex: 'approveRemark',
      slotName: 'approveRemark',
      width: 200,
    },
    {
      title: t('workspace.requestList.columns.createTime'),
      dataIndex: 'createTime',
      slotName: 'createTime',
      width: 160,
    },
    {
      title: t('workspace.requestList.columns.action'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
      fixed: 'right',
    },
  ]);

  const requestTypeOptions = computed(() => [
    { value: 1, label: t('workspace.request.type.shiftChange') },
    { value: 2, label: t('workspace.request.type.leave') },
    { value: 3, label: t('workspace.request.type.extraSlot') },
  ]);

  const statusOptions = computed(() => [
    { value: 1, label: t('workspace.request.status.pending') },
    { value: 2, label: t('workspace.request.status.approved') },
    { value: 3, label: t('workspace.request.status.rejected') },
    { value: 4, label: t('workspace.request.status.cancelled') },
  ]);

  const slotTypeOptions = computed(() => [
    { value: 1, label: t('schedulePage.slotType.normal') },
    { value: 2, label: t('schedulePage.slotType.expert') },
    { value: 3, label: t('schedulePage.slotType.special') },
  ]);

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

  const getPeriodText = (period?: number) =>
    period ? slotPeriodMap[period] || `#${period}` : '-';

  const getSlotTypeText = (slotType?: number) => {
    const found = slotTypeOptions.value.find((item) => item.value === slotType);
    return found?.label || `#${slotType}`;
  };

  const getRequestTypeText = (requestType?: number) => {
    const found = requestTypeOptions.value.find(
      (item) => item.value === requestType
    );
    return found?.label || `#${requestType}`;
  };

  const getStatusText = (status?: number) => {
    const found = statusOptions.value.find((item) => item.value === status);
    return found?.label || `#${status}`;
  };

  const statusTagColor = (status?: number) => {
    if (status === 1) return 'orangered';
    if (status === 2) return 'green';
    if (status === 3) return 'red';
    if (status === 4) return 'gray';
    return 'gray';
  };

  const requestTypeTagColor = (type?: number) => {
    if (type === 1) return 'arcoblue';
    if (type === 2) return 'gold';
    return 'purple';
  };

  const formatDate = (date?: string) =>
    date ? dayjs(date).format('YYYY-MM-DD') : '-';
  const formatDateTime = (date?: string) =>
    date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-';

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getScheduleRequests({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        requestType: formModel.requestType,
        status: formModel.status,
      });
      const list =
        (data as any)?.list ||
        (data as any)?.records ||
        (data as any)?.rows ||
        [];
      const total =
        (data as any)?.total ||
        (data as any)?.pageTotal ||
        (data as any)?.count ||
        list.length ||
        0;
      renderData.value = list;
      pagination.total = total;
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('获取排班申请列表失败', err);
      Message.error(
        err?.response?.data?.msg || t('workspace.requestList.fetchError')
      );
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    pagination.current = 1;
    fetchData();
  };

  const reset = () => {
    formModel.requestType = undefined;
    formModel.status = undefined;
    pagination.current = 1;
    fetchData();
  };

  const onPageChange = (page: number) => {
    pagination.current = page;
    fetchData();
  };

  const openApprovalModal = (
    record: ScheduleRequestListDTO,
    type: 'approve' | 'reject'
  ) => {
    pendingRecord.value = record;
    actionType.value = type;
    approveRemark.value = '';
    approvalModalVisible.value = true;
  };

  const submitApproval = async () => {
    if (!pendingRecord.value) return;
    if (!approveRemark.value) {
      Message.warning(t('approvalPage.operation.remarkPlaceholder'));
      return;
    }
    try {
      submitLoading.value = true;
      await handleScheduleRequest(pendingRecord.value.requestId, {
        approved: actionType.value === 'approve',
        approveRemark: approveRemark.value,
      });
      Message.success(
        actionType.value === 'approve'
          ? t('approvalPage.message.approveSuccess')
          : t('approvalPage.message.rejectSuccess')
      );
      approvalModalVisible.value = false;
      fetchData();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('审批失败', err);
      Message.error(
        err?.response?.data?.msg ||
          (actionType.value === 'approve'
            ? t('approvalPage.message.approveError')
            : t('approvalPage.message.rejectError'))
      );
    } finally {
      submitLoading.value = false;
    }
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    size.value = val as SizeProps;
  };

  onMounted(() => {
    fetchData();
  });
</script>

<style scoped lang="less">
  .approval-list {
    .action-icon {
      margin-left: 12px;
      cursor: pointer;
    }

    .active {
      color: #0960bd;
      background-color: #e3f4fc;
    }
  }
  .cell-line {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-text-1);
  }

  .cell-sub {
    color: var(--color-text-3);
    font-size: 12px;
    margin-top: 2px;
  }
</style>
