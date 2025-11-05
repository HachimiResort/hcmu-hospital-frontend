<template>
  <a-card
    class="doctor-panel"
    :title="$t('schedulePage.doctorPanel.title')"
    :bordered="false"
    :header-style="{
      paddingBottom: '0',
    }"
    :body-style="{
      height: '100%',
      paddingTop: '16px',
      display: 'flex',
      flexFlow: 'column',
    }"
  >
    <a-space size="medium" direction="vertical" style="flex: 1; width: 100%">
      <!-- 科室树 -->
      <a-card
        :title="$t('schedulePage.doctorPanel.departments')"
        :bordered="false"
      >
        <a-tree
          v-if="treeData.length > 0"
          :data="treeData"
          :default-expand-all="true"
          :selected-keys="selectedDepartmentKeys"
          @select="handleDepartmentSelect"
        >
          <template #title="nodeData">
            <template v-if="nodeData.key === 'all'">
              {{ nodeData.title }}
            </template>
            <template v-else>
              {{ nodeData.title }}
            </template>
          </template>
        </a-tree>
      </a-card>

      <!-- 医生列表 -->
      <a-card :title="$t('schedulePage.doctorPanel.doctors')" :bordered="false">
        <a-spin :loading="loading" style="width: 100%">
          <a-list
            v-if="filteredDoctors.length > 0"
            :bordered="false"
            :split="true"
          >
            <a-list-item
              v-for="doctor in filteredDoctors"
              :key="doctor.userId"
              :class="{
                'doctor-item-selected': selectedDoctorUserId === doctor.userId,
              }"
              class="doctor-item"
              @click="handleDoctorSelect(doctor)"
            >
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar>
                    <icon-user />
                  </a-avatar>
                </template>
                <template #title>
                  {{ doctor.userName }}
                </template>
                <template #description>
                  {{ doctor.title }} | {{ doctor.specialty }}
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
          <a-empty
            v-else
            :description="$t('schedulePage.doctorPanel.noDoctors')"
          />
        </a-spin>
      </a-card>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
  import { computed, defineProps, onMounted, PropType, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { getAllDepartments, DepartmentListDTO } from '@/api/department';
  import {
    getAllDoctorProfiles,
    DoctorProfileListDTO,
  } from '@/api/doctor-profile';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const props = defineProps({
    selectedDoctor: {
      type: Function as PropType<
        (doctorId: number, doctorName: string) => void
      >,
      required: true,
    },
  });

  interface TreeNodeData {
    key: string;
    title: string;
    children?: TreeNodeData[];
  }

  const departments = ref<DepartmentListDTO[]>([]);
  const doctors = ref<DoctorProfileListDTO[]>([]);
  const selectedDepartmentKeys = ref<string[]>(['all']);
  const selectedDepartmentId = ref<number | null>(null);
  const selectedDoctorUserId = ref<number>(0);

  // 构建科室树数据
  const treeData = computed<TreeNodeData[]>(() => {
    const tree: TreeNodeData[] = [
      {
        key: 'all',
        title: t('schedulePage.doctorPanel.allDepartments'),
        children: [],
      },
    ];

    const departmentMap = new Map<number, TreeNodeData>();

    // 创建所有科室节点
    departments.value.forEach((dept) => {
      departmentMap.set(dept.departmentId, {
        key: `dept-${dept.departmentId}`,
        title: dept.name,
        children: [],
      });
    });

    // 构建树形结构
    departments.value.forEach((dept) => {
      const node = departmentMap.get(dept.departmentId);
      if (node) {
        if (dept.parentId === 0) {
          // 一级科室，添加到根节点
          tree[0].children!.push(node);
        } else {
          // 子科室，添加到父科室
          const parentNode = departmentMap.get(dept.parentId);
          if (parentNode) {
            if (!parentNode.children) {
              parentNode.children = [];
            }
            parentNode.children.push(node);
          }
        }
      }
    });

    return tree;
  });

  // 根据选中的科室过滤医生
  const filteredDoctors = computed(() => {
    if (selectedDepartmentId.value === null) {
      return doctors.value;
    }
    return doctors.value.filter(
      (doctor) => doctor.departmentId === selectedDepartmentId.value
    );
  });

  // 处理科室选择
  const handleDepartmentSelect = (selectedKeys: Array<string | number>) => {
    if (selectedKeys.length === 0) return;

    selectedDepartmentKeys.value = [String(selectedKeys[0])];
    const key = String(selectedKeys[0]);

    if (key === 'all') {
      selectedDepartmentId.value = null;
    } else {
      const deptId = Number(key.replace('dept-', ''));
      selectedDepartmentId.value = deptId;
    }
  };

  // 处理医生选择
  const handleDoctorSelect = (doctor: DoctorProfileListDTO) => {
    selectedDoctorUserId.value = doctor.userId;
    props.selectedDoctor(doctor.userId, doctor.userName);
  };

  // 获取科室列表
  const fetchDepartments = async () => {
    try {
      const { data } = await getAllDepartments({
        pageNum: 1,
        pageSize: 1000,
      });
      departments.value = data.list;
    } catch (err) {
      Message.error(t('schedulePage.doctorPanel.fetchDepartmentsError'));
    }
  };

  // 获取医生列表
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await getAllDoctorProfiles({
        pageNum: 1,
        pageSize: 1000,
      });
      doctors.value = data.list;
    } catch (err) {
      Message.error(t('schedulePage.doctorPanel.fetchDoctorsError'));
    } finally {
      setLoading(false);
    }
  };

  onMounted(async () => {
    await fetchDepartments();
    await fetchDoctors();
  });
</script>

<style lang="less" scoped>
  .doctor-panel {
    height: calc(100vh - 180px);

    :deep(.arco-card-body) {
      overflow-y: auto;
    }
  }

  .doctor-item {
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
    padding: 8px;

    &:hover {
      background-color: var(--color-fill-2);
    }

    &-selected {
      background-color: var(--color-primary-light-1);

      &:hover {
        background-color: var(--color-primary-light-2);
      }
    }
  }
</style>
