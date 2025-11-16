<template>
  <div class="schedule-list">
    <a-card class="general-card" :title="$t('schedulePage.title')">
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
                  field="doctorUserId"
                  :label="$t('schedulePage.form.doctorUserId')"
                >
                  <a-select
                    v-model="formModel.doctorUserId"
                    :placeholder="
                      $t('schedulePage.form.doctorUserId.placeholder')
                    "
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="doctor in doctorOptions"
                      :key="doctor.userId"
                      :value="doctor.userId"
                      :label="doctor.userName"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="scheduleStartDate"
                  :label="$t('schedulePage.form.scheduleStartDate')"
                >
                  <a-date-picker
                    v-model="formModel.scheduleStartDate"
                    :placeholder="
                      $t('schedulePage.form.scheduleStartDate.placeholder')
                    "
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="scheduleEndDate"
                  :label="$t('schedulePage.form.scheduleEndDate')"
                >
                  <a-date-picker
                    v-model="formModel.scheduleEndDate"
                    :placeholder="
                      $t('schedulePage.form.scheduleEndDate.placeholder')
                    "
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="10">
              <a-col :span="8">
                <a-form-item
                  field="slotType"
                  :label="$t('schedulePage.form.slotType')"
                >
                  <a-select
                    v-model="formModel.slotType"
                    :placeholder="$t('schedulePage.form.slotType.placeholder')"
                    allow-clear
                  >
                    <a-option
                      :value="1"
                      :label="$t('schedulePage.slotType.normal')"
                    />
                    <a-option
                      :value="2"
                      :label="$t('schedulePage.slotType.expert')"
                    />
                    <a-option
                      :value="3"
                      :label="$t('schedulePage.slotType.special')"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('schedulePage.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :placeholder="$t('schedulePage.form.status.placeholder')"
                    allow-clear
                  >
                    <a-option
                      :value="1"
                      :label="$t('schedulePage.status.open')"
                    />
                    <a-option
                      :value="2"
                      :label="$t('schedulePage.status.full')"
                    />
                    <a-option
                      :value="3"
                      :label="$t('schedulePage.status.closed')"
                    />
                  </a-select>
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
          <a-space>
            <a-button
              v-permission="{ permissionsTarget: ['ADD_SCHEDULE'] }"
              type="primary"
              @click="handleAdd"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('schedulePage.button.add') }}
            </a-button>
            <a-button
              v-permission="{ permissionsTarget: ['DEL_SCHEDULE'] }"
              status="danger"
              :disabled="selectedKeys.length === 0"
              @click="handleBatchDelete"
            >
              <template #icon>
                <icon-delete />
              </template>
              {{ $t('schedulePage.button.batchDelete') }}
            </a-button>
            <a-button
              v-permission="{ permissionsTarget: ['ADD_SCHEDULE'] }"
              @click="handleCopySchedule"
            >
              <template #icon>
                <icon-copy />
              </template>
              {{ $t('schedulePage.button.copySchedule') }}
            </a-button>
          </a-space>
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
        v-model:selected-keys="selectedKeys"
        row-key="scheduleId"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
        :row-selection="rowSelection"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #slotType="{ record }">
          <a-tag
            :color="
              record.slotType === 1
                ? 'blue'
                : record.slotType === 2
                ? 'green'
                : 'orange'
            "
          >
            {{
              record.slotType === 1
                ? $t('schedulePage.slotType.normal')
                : record.slotType === 2
                ? $t('schedulePage.slotType.expert')
                : $t('schedulePage.slotType.special')
            }}
          </a-tag>
        </template>
        <template #slotPeriod="{ record }">
          <a-tag :color="record.slotPeriod <= 6 ? 'blue' : 'orange'">
            {{ getSlotPeriodLabel(record.slotPeriod) }}
          </a-tag>
        </template>
        <template #status="{ record }">
          <a-tag
            :color="
              record.status === 1
                ? 'green'
                : record.status === 2
                ? 'orange'
                : 'red'
            "
          >
            {{
              record.status === 1
                ? $t('schedulePage.status.open')
                : record.status === 2
                ? $t('schedulePage.status.full')
                : $t('schedulePage.status.closed')
            }}
          </a-tag>
        </template>
        <template #operations="{ record }">
          <a-button
            v-permission="{ permissionsTarget: ['ALT_SCHEDULE'] }"
            type="text"
            size="small"
            @click="handleEdit(record)"
          >
            {{ $t('schedulePage.columns.operations.edit') }}
          </a-button>
          <a-button
            v-permission="{ permissionsTarget: ['DEL_SCHEDULE'] }"
            type="text"
            size="small"
            status="danger"
            @click="handleDelete(record)"
          >
            {{ $t('schedulePage.columns.operations.delete') }}
          </a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <ScheduleModal
      :visible="modalVisible"
      :schedule-id="currentScheduleId"
      @cancel="handleModalCancel"
      @success="handleModalSuccess"
    />

    <!-- 复制排班弹窗 -->
    <ScheduleCopyModal
      :visible="copyModalVisible"
      @cancel="handleCopyModalCancel"
      @success="handleCopyModalSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, Modal, type TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    getAllSchedules,
    deleteSchedule,
    batchDeleteSchedules,
    ScheduleListDTO,
    ScheduleGetRequestDTO,
  } from '@/api/schedule';
  import {
    getAllDoctorProfiles,
    DoctorProfileListDTO,
  } from '@/api/doctor-profile';
  import { Pagination } from '@/types/global';
  import ScheduleModal from './schedule-modal.vue';
  import ScheduleCopyModal from './schedule-copy-modal.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单数据
  const formModel = reactive<ScheduleGetRequestDTO>({
    doctorUserId: undefined,
    scheduleStartDate: undefined,
    scheduleEndDate: undefined,
    slotType: undefined,
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  });

  // 医生选项
  const doctorOptions = ref<DoctorProfileListDTO[]>([]);

  // 表格数据
  const renderData = ref<ScheduleListDTO[]>([]);
  const size = ref<SizeProps>('medium');

  // 分页
  const pagination = reactive<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: true,
    showPageSize: true,
  });

  // 选中的行
  const selectedKeys = ref<number[]>([]);
  const rowSelection = reactive({
    type: 'checkbox' as const,
    showCheckedAll: true,
    onlyCurrent: false,
    selectedRowKeys: selectedKeys,
    onSelect: (rowKeys: number[]) => {
      selectedKeys.value = rowKeys;
    },
    onSelectAll: (checked: boolean) => {
      if (checked) {
        selectedKeys.value = renderData.value.map((item) => item.scheduleId);
      } else {
        selectedKeys.value = [];
      }
    },
  });

  // 弹窗相关
  const modalVisible = ref(false);
  const currentScheduleId = ref<number>();

  // 复制排班弹窗
  const copyModalVisible = ref(false);

  // 表格密度
  const densityList = computed(() => [
    { name: t('listBoard.mini'), value: 'mini' },
    { name: t('listBoard.small'), value: 'small' },
    { name: t('listBoard.medium'), value: 'medium' },
    { name: t('listBoard.large'), value: 'large' },
  ]);

  // 表格列定义
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('schedulePage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 80,
    },
    {
      title: t('schedulePage.columns.doctorUserId'),
      dataIndex: 'doctorUserId',
      width: 120,
    },
    {
      title: t('schedulePage.columns.scheduleDate'),
      dataIndex: 'scheduleDate',
      width: 120,
    },
    {
      title: t('schedulePage.columns.slotType'),
      dataIndex: 'slotType',
      slotName: 'slotType',
      width: 100,
    },
    {
      title: t('schedulePage.columns.slotPeriod'),
      dataIndex: 'slotPeriod',
      slotName: 'slotPeriod',
      width: 120,
    },
    {
      title: t('schedulePage.columns.totalSlots'),
      dataIndex: 'totalSlots',
      width: 100,
    },
    {
      title: t('schedulePage.columns.availableSlots'),
      dataIndex: 'availableSlots',
      width: 120,
    },
    {
      title: t('schedulePage.columns.fee'),
      dataIndex: 'fee',
      width: 100,
    },
    {
      title: t('schedulePage.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
    },
    {
      title: t('schedulePage.columns.operations.title'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 200,
      fixed: 'right',
    },
  ]);

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

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const params: ScheduleGetRequestDTO = {
        ...formModel,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      const { data } = await getAllSchedules(params);
      renderData.value = data.list;
      pagination.total = data.total;
    } catch (err) {
      Message.error(t('schedulePage.message.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const search = () => {
    pagination.current = 1;
    fetchData();
  };

  // 重置
  const reset = () => {
    formModel.doctorUserId = undefined;
    formModel.scheduleStartDate = undefined;
    formModel.scheduleEndDate = undefined;
    formModel.slotType = undefined;
    formModel.status = undefined;
    search();
  };

  // 分页改变
  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData();
  };

  // 表格密度改变
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    size.value = val as SizeProps;
  };

  // 获取时段标签
  const getSlotPeriodLabel = (slotPeriod: number) => {
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
    return slotPeriodMap[slotPeriod] || `时段${slotPeriod}`;
  };

  // 新增
  const handleAdd = () => {
    currentScheduleId.value = undefined;
    modalVisible.value = true;
  };

  // 编辑
  const handleEdit = (record: ScheduleListDTO) => {
    currentScheduleId.value = record.scheduleId;
    modalVisible.value = true;
  };

  // 删除
  const handleDelete = (record: ScheduleListDTO) => {
    Modal.confirm({
      title: t('schedulePage.message.deleteConfirm'),
      content: t('schedulePage.message.deleteConfirmContent'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteSchedule(record.scheduleId);
          Message.success(t('schedulePage.message.deleteSuccess'));
          fetchData();
        } catch (err) {
          Message.error(t('schedulePage.message.deleteError'));
        }
      },
    });
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedKeys.value.length === 0) {
      Message.warning(t('schedulePage.message.selectAtLeastOne'));
      return;
    }
    Modal.confirm({
      title: t('schedulePage.message.batchDeleteConfirm'),
      content: t('schedulePage.message.batchDeleteConfirmContent'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await batchDeleteSchedules(selectedKeys.value);
          Message.success(t('schedulePage.message.batchDeleteSuccess'));
          selectedKeys.value = [];
          fetchData();
        } catch (err) {
          Message.error(t('schedulePage.message.batchDeleteError'));
        }
      },
    });
  };

  // 复制排班
  const handleCopySchedule = () => {
    copyModalVisible.value = true;
  };

  // 弹窗取消
  const handleModalCancel = () => {
    modalVisible.value = false;
  };

  // 弹窗成功
  const handleModalSuccess = () => {
    modalVisible.value = false;
    fetchData();
  };

  // 复制弹窗取消
  const handleCopyModalCancel = () => {
    copyModalVisible.value = false;
  };

  // 复制弹窗成功
  const handleCopyModalSuccess = () => {
    copyModalVisible.value = false;
    fetchData();
  };

  onMounted(() => {
    fetchDoctors();
    fetchData();
  });
</script>

<style lang="less" scoped>
  .schedule-list {
    .action-icon {
      margin-left: 12px;
      cursor: pointer;
    }

    .active {
      color: #0960bd;
      background-color: #e3f4fc;
    }
  }
</style>
