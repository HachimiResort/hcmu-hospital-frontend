<template>
  <div class="schedule-request-page">
    <a-card class="general-card" :title="$t('workspace.requestList.title')">
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

      <!-- 表格 -->
      <a-table
        row-key="requestId"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
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
        <template #originSchedule="{ record }">
          <div class="cell-line">
            <icon-calendar />
            <span>{{ formatDate(record.scheduleDate) }}</span>
          </div>
          <div class="cell-sub">{{ getPeriodText(record.slotPeriod) }}</div>
          <div class="cell-sub">{{ getSlotTypeText(record.slotType) }}</div>
        </template>
        <template #targetSchedule="{ record }">
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
          <div v-if="record.extraSlots" class="cell-sub">
            {{ $t('workspace.request.extraSlots') }}: {{ record.extraSlots }}
          </div>
        </template>
        <template #reason="{ record }">
          {{ record.reason || '-' }}
        </template>
        <template #approveRemark="{ record }">
          {{ record.approveRemark || '-' }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button
              v-if="record.status === 1"
              type="text"
              size="small"
              status="warning"
              @click="handleCancel(record)"
            >
              {{ $t('workspace.requestList.action.cancel') }}
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { Message, Modal, type TableColumnData } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';
  import {
    cancelScheduleRequest,
    getScheduleRequests,
    ScheduleRequestListDTO,
  } from '@/api/schedule-request';
  import { Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';

  const { t } = useI18n();
  const userStore = useUserStore();
  const { loading, setLoading } = useLoading(true);
  const renderData = ref<ScheduleRequestListDTO[]>([]);
  const pagination = reactive<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const formModel = reactive({
    requestType: undefined as number | undefined,
    status: undefined as number | undefined,
  });

  const requestTypeOptions = computed(() => [
    { value: 1, label: t('workspace.request.type.shiftChange') },
    { value: 2, label: t('workspace.request.type.leave') },
    { value: 3, label: t('workspace.request.type.extraSlot') },
  ]);

  const slotTypeOptions = computed(() => [
    { value: 1, label: t('schedulePage.slotType.normal') },
    { value: 2, label: t('schedulePage.slotType.expert') },
    { value: 3, label: t('schedulePage.slotType.special') },
  ]);

  const statusOptions = computed(() => [
    { value: 1, label: t('workspace.request.status.pending') },
    { value: 2, label: t('workspace.request.status.approved') },
    { value: 3, label: t('workspace.request.status.rejected') },
    { value: 4, label: t('workspace.request.status.cancelled') },
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

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('importPage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 80,
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
      width: 180,
    },
    {
      title: t('workspace.requestList.columns.approveRemark'),
      dataIndex: 'approveRemark',
      slotName: 'approveRemark',
      width: 180,
    },
    {
      title: t('workspace.requestList.columns.createTime'),
      dataIndex: 'createTime',
      render: ({ record }) => formatDateTime(record.createTime),
      width: 160,
    },
    {
      title: t('workspace.requestList.columns.action'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 120,
      fixed: 'right',
    },
  ]);

  const fetchList = async () => {
    if (!userStore.userId) return;
    try {
      setLoading(true);
      const { data } = await getScheduleRequests({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        doctorUserId: userStore.userId,
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
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('获取排班申请列表失败', error);
      Message.error(
        error?.response?.data?.msg || t('workspace.requestList.fetchError')
      );
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    pagination.current = 1;
    fetchList();
  };

  const reset = () => {
    formModel.requestType = undefined;
    formModel.status = undefined;
    pagination.current = 1;
    fetchList();
  };

  const onPageChange = (page: number) => {
    pagination.current = page;
    fetchList();
  };

  const handleCancel = (record: ScheduleRequestListDTO) => {
    Modal.confirm({
      title: t('workspace.requestList.action.cancel'),
      content: t('workspace.requestList.cancelConfirm'),
      okText: t('importPage.operation.confirm'),
      cancelText: t('importPage.operation.cancel'),
      onOk: async () => {
        try {
          await cancelScheduleRequest(record.requestId);
          Message.success(t('workspace.requestList.cancelSuccess'));
          fetchList();
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error('撤销排班申请失败', error);
          Message.error(
            error?.response?.data?.msg || t('workspace.requestList.cancelError')
          );
        }
      },
    });
  };

  onMounted(() => {
    if (!userStore.userId) {
      const timer = setInterval(() => {
        if (userStore.userId) {
          clearInterval(timer);
          fetchList();
        }
      }, 100);
      setTimeout(() => clearInterval(timer), 3000);
    } else {
      fetchList();
    }
  });
</script>

<style scoped lang="less">
  .schedule-request-page {
    padding: 20px;
    background-color: var(--color-fill-1);
    min-height: calc(100vh - 60px);

    .request-table {
      margin-top: 16px;
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

    .pagination-bar {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
