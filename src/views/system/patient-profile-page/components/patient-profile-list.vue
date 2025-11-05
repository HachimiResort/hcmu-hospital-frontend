<template>
  <div class="patient-profile-list">
    <a-card class="general-card" :title="$t('patientProfilePage.title')">
      <!-- 搜索表单 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" label-align="left">
            <a-row :gutter="10">
              <a-col :span="12">
                <a-form-item
                  field="identityType"
                  :label="$t('patientProfilePage.form.identityType')"
                >
                  <a-select
                    v-model="formModel.identityType"
                    :placeholder="
                      $t('patientProfilePage.form.identityType.placeholder')
                    "
                    allow-clear
                  >
                    <a-option
                      v-for="item in identityOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  field="name"
                  :label="$t('patientProfilePage.form.name')"
                >
                  <a-input
                    v-model="formModel.name"
                    :placeholder="
                      $t('patientProfilePage.form.name.placeholder')
                    "
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
        <a-col
          :span="24"
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
        row-key="patientProfileId"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #identityType="{ record }">
          {{ getIdentityLabel(record.identityType) }}
        </template>
        <template #operations="{ record }">
          <a-button
            v-permission="{ permissionsTarget: ['ALT_PATIENT'] }"
            type="text"
            size="small"
            @click="handleEdit(record)"
          >
            {{ $t('patientProfilePage.columns.operations.edit') }}
          </a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <PatientProfileModal
      :visible="modalVisible"
      :user-id="currentUserId"
      @cancel="handleModalCancel"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, type TableColumnData } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import {
    getPatientProfiles,
    PatientProfileListDTO,
    PatientProfileGetRequestDTO,
  } from '@/api/patient-profile';
  import { Pagination } from '@/types/global';
  import PatientProfileModal from './patient-profile-modal.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 表单数据
  const formModel = reactive<any>({
    identityType: undefined,
    name: '',
    pageNum: 1,
    pageSize: 10,
  });

  // 表格数据
  const renderData = ref<PatientProfileListDTO[]>([]);
  const size = ref<SizeProps>('medium');

  // 分页
  const pagination = reactive<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: true,
    showPageSize: true,
  });

  // 弹窗相关
  const modalVisible = ref(false);
  const currentUserId = ref<number>();

  // 表格密度
  const densityList = computed(() => [
    { name: t('listBoard.mini'), value: 'mini' },
    { name: t('listBoard.small'), value: 'small' },
    { name: t('listBoard.medium'), value: 'medium' },
    { name: t('listBoard.large'), value: 'large' },
  ]);

  // 身份类型选项（本地定义，如有后端字典可替换）
  const identityOptions = ref([
    { value: '', label: t('patientProfilePage.identity.all') },
    { value: 1, label: t('patientProfilePage.identity.student') },
    { value: 2, label: t('patientProfilePage.identity.teacher') },
    { value: 0, label: t('patientProfilePage.identity.other') },
  ]);

  // 将 identityType 的值映射为文本标签。1 -> student, 2 -> teacher, 其他 -> other
  const getIdentityLabel = (val: number | string | undefined) => {
    if (val === 1 || val === '1')
      return t('patientProfilePage.identity.student');
    if (val === 2 || val === '2')
      return t('patientProfilePage.identity.teacher');
    return t('patientProfilePage.identity.other');
  };

  // 表格列定义
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('patientProfilePage.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 80,
    },
    { title: t('patientProfilePage.columns.userName'), dataIndex: 'userName' },
    { title: t('patientProfilePage.columns.name'), dataIndex: 'name' },
    {
      title: t('patientProfilePage.columns.identityType'),
      dataIndex: 'identityType',
      slotName: 'identityType',
    },
    {
      title: t('patientProfilePage.columns.studentTeacherId'),
      dataIndex: 'studentTeacherId',
    },
    {
      title: t('patientProfilePage.columns.emergencyContact'),
      dataIndex: 'emergencyContact',
    },
    {
      title: t('patientProfilePage.columns.operations.title'),
      dataIndex: 'operations',
      slotName: 'operations',
      width: 180,
      fixed: 'right',
    },
  ]);

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const params: PatientProfileGetRequestDTO = {
        ...formModel,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      const { data } = await getPatientProfiles(params);
      renderData.value = data.list;
      pagination.total = data.total;
    } catch (err) {
      Message.error(t('patientProfilePage.message.fetchError'));
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
    formModel.identityType = undefined;
    (formModel as any).name = '';
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

  // 编辑
  const handleEdit = (record: PatientProfileListDTO) => {
    currentUserId.value = record.userId;
    modalVisible.value = true;
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

  onMounted(() => {
    fetchData();
  });
</script>

<style lang="less" scoped>
  .patient-profile-list {
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
