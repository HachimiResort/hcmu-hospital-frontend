<template>
  <div class="operation-rule-list">
    <a-card class="general-card" :title="$t('operationRulePage.title')">
      <!-- 操作按钮区域（仅刷新和密度） -->
      <a-row style="margin-bottom: 16px">
        <a-col
          :span="24"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <a-tooltip :content="$t('listBoard.refresh')">
            <div class="action-icon" @click="fetchData">
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
        row-key="code"
        :loading="loading"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>
        <template #range="{ record }">
          {{ record.minValue }} ~ {{ record.maxValue }}
        </template>
        <template #value="{ record }">
          <span>{{ record.value }}</span>
          <a-button
            v-permission="{ permissionsTarget: ['ALT_RULE'] }"
            type="text"
            size="small"
            @click="editValue(record)"
            >{{ $t('operationRulePage.columns.operations.edit') }}</a-button
          >
        </template>
        <template #enabled="{ record }">
          <a-switch
            v-permission="{ permissionsTarget: ['ALT_RULE'] }"
            :model-value="record.enabled === 1"
            @change="onSwitchChange(record, $event)"
          />
          <template v-if="!hasAltPermission">
            <a-tag v-if="record.enabled === 1" color="green">ON</a-tag>
            <a-tag v-else color="red">OFF</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <OperationRuleModal
      :visible="modalVisible"
      :rule="currentRule"
      @cancel="handleModalCancel"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, type TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    getAllOperationRules,
    updateOperationRule,
    type OperationRuleListDTO,
  } from '@/api/operation-rule';
  import { useAppStore } from '@/store';
  import OperationRuleModal from './operation-rule-modal.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const appStore = useAppStore();

  const renderData = ref<OperationRuleListDTO[]>([]);
  const size = ref<SizeProps>('medium');

  // 权限判断：permissions 可能是数组或对象，做兼容处理
  const hasAltPermission = computed(() => {
    const perms: any = appStore.permissions;
    if (Array.isArray(perms)) return perms.includes('ALT_RULE');
    if (perms && typeof perms === 'object')
      return Object.values(perms).includes('ALT_RULE');
    return false;
  });

  const densityList = computed(() => [
    { name: t('listBoard.mini'), value: 'mini' },
    { name: t('listBoard.small'), value: 'small' },
    { name: t('listBoard.medium'), value: 'medium' },
    { name: t('listBoard.large'), value: 'large' },
  ]);

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('operationRulePage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 80,
    },
    { title: t('operationRulePage.columns.name'), dataIndex: 'name' },
    {
      title: t('operationRulePage.columns.description'),
      dataIndex: 'description',
    },
    {
      title: t('operationRulePage.columns.range'),
      dataIndex: 'range',
      slotName: 'range',
      width: 160,
    },
    {
      title: t('operationRulePage.columns.value'),
      dataIndex: 'value',
      slotName: 'value',
      width: 160,
    },
    {
      title: t('operationRulePage.columns.defaultValue'),
      dataIndex: 'defaultValue',
      width: 120,
    },
    {
      title: t('operationRulePage.columns.enabled'),
      dataIndex: 'enabled',
      slotName: 'enabled',
      width: 140,
    },
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOperationRules();
      renderData.value = data;
    } catch (err) {
      Message.error(t('operationRulePage.message.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // 切换启用
  const toggleEnabled = async (record: OperationRuleListDTO, val: boolean) => {
    try {
      await updateOperationRule(record.code, { enabled: val ? 1 : 0 });
      Message.success(t('operationRulePage.message.updateSuccess'));
      fetchData();
    } catch (err) {
      Message.error(t('operationRulePage.message.updateError'));
    }
  };

  // Switch change 事件（Arco 传入 value: string | number | boolean）
  const onSwitchChange = (
    record: OperationRuleListDTO,
    value: string | number | boolean
  ) => {
    const boolVal =
      value === true || value === 1 || value === 'true' || value === '1';
    toggleEnabled(record, boolVal);
  };

  // 编辑值
  const modalVisible = ref(false);
  const currentRule = ref<OperationRuleListDTO | undefined>(undefined);
  const editValue = (record: OperationRuleListDTO) => {
    currentRule.value = record;
    modalVisible.value = true;
  };

  const handleModalCancel = () => {
    modalVisible.value = false;
  };

  const handleModalSuccess = () => {
    modalVisible.value = false;
    fetchData();
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

<style lang="less" scoped>
  .operation-rule-list {
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
