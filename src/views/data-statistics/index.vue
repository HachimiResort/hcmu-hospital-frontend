<template>
  <div class="data-statistics-container">
    <!-- 时间范围选择器 -->
    <div class="time-range-selector">
      <a-button type="primary" :loading="exportLoading" @click="handleExport">
        {{ $t('dataStatistics.export') }}
      </a-button>
      <a-radio-group
        v-model="timeRange"
        type="button"
        @change="handleTimeRangeChange"
      >
        <a-radio value="DAY">{{ $t('dataStatistics.timeRange.day') }}</a-radio>
        <a-radio value="WEEK">{{
          $t('dataStatistics.timeRange.week')
        }}</a-radio>
        <a-radio value="MONTH">{{
          $t('dataStatistics.timeRange.month')
        }}</a-radio>
        <a-radio value="ALL">{{ $t('dataStatistics.timeRange.all') }}</a-radio>
      </a-radio-group>
    </div>

    <!-- 号源统计 -->
    <a-card
      class="section-card"
      :title="$t('dataStatistics.appointment.title')"
      :bordered="false"
    >
      <a-spin :loading="appointmentLoading">
        <a-row :gutter="16">
          <a-col :xs="12" :sm="12" :md="8" :lg="4">
            <a-statistic
              :title="$t('dataStatistics.appointment.pendingPayment')"
              :value="appointmentStats.pendingPaymentCount"
              :value-style="{ color: '#f7ba2a' }"
            >
              <template #prefix>
                <icon-clock-circle />
              </template>
            </a-statistic>
          </a-col>
          <a-col :xs="12" :sm="12" :md="8" :lg="4">
            <a-statistic
              :title="$t('dataStatistics.appointment.booked')"
              :value="appointmentStats.bookedCount"
              :value-style="{ color: '#165dff' }"
            >
              <template #prefix>
                <icon-check-circle />
              </template>
            </a-statistic>
          </a-col>
          <a-col :xs="12" :sm="12" :md="8" :lg="4">
            <a-statistic
              :title="$t('dataStatistics.appointment.completed')"
              :value="appointmentStats.completedCount"
              :value-style="{ color: '#00b42a' }"
            >
              <template #prefix>
                <icon-check-circle-fill />
              </template>
            </a-statistic>
          </a-col>
          <a-col :xs="12" :sm="12" :md="8" :lg="4">
            <a-statistic
              :title="$t('dataStatistics.appointment.cancelled')"
              :value="appointmentStats.cancelledCount"
              :value-style="{ color: '#86909c' }"
            >
              <template #prefix>
                <icon-close-circle />
              </template>
            </a-statistic>
          </a-col>
          <a-col :xs="12" :sm="12" :md="8" :lg="4">
            <a-statistic
              :title="$t('dataStatistics.appointment.noShow')"
              :value="appointmentStats.noShowCount"
              :value-style="{ color: '#f53f3f' }"
            >
              <template #prefix>
                <icon-exclamation-circle />
              </template>
            </a-statistic>
          </a-col>
          <a-col :xs="12" :sm="12" :md="8" :lg="4">
            <a-statistic
              :title="$t('dataStatistics.appointment.totalRevenue')"
              :value="appointmentStats.totalRevenue"
              :precision="2"
              :value-style="{ color: '#ff7d00' }"
            >
              <template #prefix> ¥ </template>
            </a-statistic>
          </a-col>
        </a-row>

        <!-- 预约趋势图 -->
        <div class="chart-container">
          <h3 class="chart-title">
            {{ $t('dataStatistics.appointment.trendTitle') }}
          </h3>
          <Chart :option="appointmentTrendOption" height="300px" />
        </div>
      </a-spin>
    </a-card>

    <a-row :gutter="16">
      <!-- 科室统计 -->
      <a-col :xs="24" :lg="12">
        <a-card
          class="section-card"
          :title="$t('dataStatistics.department.title')"
          :bordered="false"
        >
          <a-spin :loading="departmentLoading">
            <!-- 科室预约排行 -->
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">
                  {{ $t('dataStatistics.department.appointmentRank') }}
                </h3>
                <a-input-number
                  v-model="departmentRankLimit"
                  :min="5"
                  :max="20"
                  :style="{ width: '120px' }"
                  @change="fetchDepartmentRank"
                >
                  <template #prefix>
                    {{ $t('dataStatistics.topLimit') }}
                  </template>
                </a-input-number>
              </div>
              <Chart :option="departmentRankOption" height="350px" />
            </div>

            <!-- 科室负荷统计 -->
            <div class="chart-container">
              <h3 class="chart-title">
                {{ $t('dataStatistics.department.loadTitle') }}
              </h3>
              <Chart :option="departmentLoadOption" height="300px" />
            </div>
          </a-spin>
        </a-card>
      </a-col>

      <!-- 医生统计 -->
      <a-col :xs="24" :lg="12">
        <a-card
          class="section-card"
          :title="$t('dataStatistics.doctor.title')"
          :bordered="false"
        >
          <a-spin :loading="doctorLoading">
            <!-- 医生收入排行 -->
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">
                  {{ $t('dataStatistics.doctor.incomeRank') }}
                </h3>
                <a-input-number
                  v-model="doctorIncomeRankLimit"
                  :min="5"
                  :max="20"
                  :style="{ width: '120px' }"
                  @change="fetchDoctorIncomeRank"
                >
                  <template #prefix>
                    {{ $t('dataStatistics.topLimit') }}
                  </template>
                </a-input-number>
              </div>
              <Chart :option="doctorIncomeRankOption" height="300px" />
            </div>

            <!-- 医生就诊量排行 -->
            <div class="chart-container">
              <div class="chart-header">
                <h3 class="chart-title">
                  {{ $t('dataStatistics.doctor.visitRank') }}
                </h3>
                <a-input-number
                  v-model="doctorVisitRankLimit"
                  :min="5"
                  :max="20"
                  :style="{ width: '120px' }"
                  @change="fetchDoctorVisitRank"
                >
                  <template #prefix>
                    {{ $t('dataStatistics.topLimit') }}
                  </template>
                </a-input-number>
              </div>
              <Chart :option="doctorVisitRankOption" height="300px" />
            </div>

            <!-- 医生预约率统计 -->
            <div class="chart-container">
              <h3 class="chart-title">
                {{ $t('dataStatistics.doctor.appointmentRateTitle') }}
              </h3>
              <Chart :option="doctorAppointmentRateOption" height="300px" />
            </div>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import Chart from '@/components/chart/index.vue';
  import type { TimeRange } from '@/api/dashboard';
  import {
    getAppointmentStatistics,
    getAppointmentTrend,
    getDepartmentAppointmentRank,
    getDepartmentLoad,
    getDoctorAppointmentRate,
    getDoctorIncomeRank,
    getDoctorVisitRank,
  } from '@/api/dashboard';
  import { exportDashboardData } from '@/api/common';

  const { t } = useI18n();

  // 时间范围
  const timeRange = ref<TimeRange>('DAY');
  const exportLoading = ref(false);

  // 加载状态
  const appointmentLoading = ref(false);
  const departmentLoading = ref(false);
  const doctorLoading = ref(false);

  // 号源统计数据
  const appointmentStats = reactive({
    pendingPaymentCount: 0,
    bookedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    noShowCount: 0,
    totalRevenue: 0,
  });

  // 预约趋势数据
  const appointmentTrendData = ref<any[]>([]);

  // 科室排行数据
  const departmentRankData = ref<any[]>([]);
  const departmentRankLimit = ref(10);

  // 科室负荷数据
  const departmentLoadData = ref<any>({
    totalDepartments: 0,
    highLoadDepartments: 0,
    mediumLoadDepartments: 0,
    lowLoadDepartments: 0,
    idleDepartments: 0,
  });

  // 医生收入排行数据
  const doctorIncomeRankData = ref<any[]>([]);
  const doctorIncomeRankLimit = ref(10);

  // 医生就诊量排行数据
  const doctorVisitRankData = ref<any[]>([]);
  const doctorVisitRankLimit = ref(10);

  // 医生预约率数据
  const doctorAppointmentRateData = ref<any[]>([]);

  // 预约趋势图表配置
  const appointmentTrendOption = computed(() => {
    return {
      xAxis: {
        type: 'category',
        data: appointmentTrendData.value.map((item) => item.periodLabel),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: t('dataStatistics.appointment.count'),
      },
      series: [
        {
          data: appointmentTrendData.value.map((item) => item.count),
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(22, 93, 255, 0.3)' },
                { offset: 1, color: 'rgba(22, 93, 255, 0.05)' },
              ],
            },
          },
          itemStyle: {
            color: '#165dff',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
    };
  });

  // 科室预约排行图表配置
  const departmentRankOption = computed(() => {
    return {
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: departmentRankData.value
          .map((item) => item.departmentName)
          .reverse(),
        axisLabel: {
          width: 100,
          overflow: 'truncate',
        },
      },
      series: [
        {
          data: departmentRankData.value
            .map((item) => item.appointmentCount)
            .reverse(),
          type: 'bar',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#165dff' },
                { offset: 1, color: '#4080ff' },
              ],
            },
          },
          label: {
            show: true,
            position: 'right',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
    };
  });

  // 科室负荷图表配置
  const departmentLoadOption = computed(() => {
    // 过滤掉值为0的数据
    const chartData = [
      {
        value: departmentLoadData.value.highLoadDepartments,
        name: t('dataStatistics.department.highLoad'),
        itemStyle: { color: '#f53f3f' },
      },
      {
        value: departmentLoadData.value.mediumLoadDepartments,
        name: t('dataStatistics.department.mediumLoad'),
        itemStyle: { color: '#ff7d00' },
      },
      {
        value: departmentLoadData.value.lowLoadDepartments,
        name: t('dataStatistics.department.lowLoad'),
        itemStyle: { color: '#f7ba2a' },
      },
      {
        value: departmentLoadData.value.idleDepartments,
        name: t('dataStatistics.department.idle'),
        itemStyle: { color: '#00b42a' },
      },
    ].filter((item) => item.value > 0); // 过滤掉值为0的项

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: t('dataStatistics.department.loadTitle'),
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          data: chartData,
        },
      ],
    };
  });

  // 医生收入排行图表配置
  const doctorIncomeRankOption = computed(() => {
    return {
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: doctorIncomeRankData.value
          .map((item) => item.doctorName)
          .reverse(),
        axisLabel: {
          width: 80,
          overflow: 'truncate',
        },
      },
      series: [
        {
          data: doctorIncomeRankData.value
            .map((item) => item.totalIncome)
            .reverse(),
          type: 'bar',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#ff7d00' },
                { offset: 1, color: '#ffb84d' },
              ],
            },
          },
          label: {
            show: true,
            position: 'right',
            formatter: '¥{c}',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          return `${params[0].name}<br/>收入: ¥${params[0].value}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
    };
  });

  // 医生就诊量排行图表配置
  const doctorVisitRankOption = computed(() => {
    return {
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: doctorVisitRankData.value
          .map((item) => item.doctorName)
          .reverse(),
        axisLabel: {
          width: 80,
          overflow: 'truncate',
        },
      },
      series: [
        {
          data: doctorVisitRankData.value
            .map((item) => item.visitCount)
            .reverse(),
          type: 'bar',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#00b42a' },
                { offset: 1, color: '#23c343' },
              ],
            },
          },
          label: {
            show: true,
            position: 'right',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
    };
  });

  // 医生预约率图表配置
  const doctorAppointmentRateOption = computed(() => {
    const doctors = doctorAppointmentRateData.value.map(
      (item) => item.doctorName
    );
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [
          t('dataStatistics.doctor.completedRate'),
          t('dataStatistics.doctor.cancelledRate'),
          t('dataStatistics.doctor.noShowRate'),
        ],
      },
      xAxis: {
        type: 'category',
        data: doctors,
        axisLabel: {
          rotate: 45,
          width: 60,
          overflow: 'truncate',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: t('dataStatistics.doctor.completedRate'),
          type: 'bar',
          stack: 'rate',
          data: doctorAppointmentRateData.value.map((item) =>
            (item.completedRate * 100).toFixed(2)
          ),
          itemStyle: { color: '#00b42a' },
        },
        {
          name: t('dataStatistics.doctor.cancelledRate'),
          type: 'bar',
          stack: 'rate',
          data: doctorAppointmentRateData.value.map((item) =>
            (item.cancelledRate * 100).toFixed(2)
          ),
          itemStyle: { color: '#86909c' },
        },
        {
          name: t('dataStatistics.doctor.noShowRate'),
          type: 'bar',
          stack: 'rate',
          data: doctorAppointmentRateData.value.map((item) =>
            (item.noShowRate * 100).toFixed(2)
          ),
          itemStyle: { color: '#f53f3f' },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
    };
  });

  // 获取号源统计
  const fetchAppointmentStatistics = async () => {
    appointmentLoading.value = true;
    try {
      const res = await getAppointmentStatistics({
        timeRange: timeRange.value,
      });
      Object.assign(appointmentStats, res.data);
    } catch (error) {
      console.error('获取号源统计失败:', error);
      Message.error(`${t('dataStatistics.loadError')}: 号源统计`);
    } finally {
      appointmentLoading.value = false;
    }
  };

  // 获取预约趋势
  const fetchAppointmentTrend = async () => {
    appointmentLoading.value = true;
    try {
      const res = await getAppointmentTrend({ timeRange: timeRange.value });
      appointmentTrendData.value = res.data.trendData;
    } catch (error) {
      console.error('获取预约趋势失败:', error);
      Message.error(`${t('dataStatistics.loadError')}: 预约趋势`);
    } finally {
      appointmentLoading.value = false;
    }
  };

  // 获取科室预约排行
  const fetchDepartmentRank = async () => {
    departmentLoading.value = true;
    try {
      const res = await getDepartmentAppointmentRank({
        timeRange: timeRange.value,
        limit: departmentRankLimit.value,
      });
      departmentRankData.value = res.data.rankList;
    } catch (error) {
      console.error('获取科室预约排行失败:', error);
      Message.error(`${t('dataStatistics.loadError')}: 科室预约排行`);
    } finally {
      departmentLoading.value = false;
    }
  };

  // 获取科室负荷统计
  const fetchDepartmentLoad = async () => {
    departmentLoading.value = true;
    try {
      const res = await getDepartmentLoad();
      console.log('科室负荷统计响应:', res.data);
      // 如果后端返回了数据，就使用；否则使用默认值
      if (res.data) {
        departmentLoadData.value = res.data;
      } else {
        // 后端500错误时使用空数据，避免显示加载失败
        console.warn('科室负荷统计后端返回500，使用默认空数据');
        departmentLoadData.value = {
          totalDepartments: 0,
          highLoadDepartments: 0,
          mediumLoadDepartments: 0,
          lowLoadDepartments: 0,
          idleDepartments: 0,
        };
      }
    } catch (error) {
      console.error('获取科室负荷统计失败:', error);
      // 使用默认空数据，不显示错误提示
      departmentLoadData.value = {
        totalDepartments: 0,
        highLoadDepartments: 0,
        mediumLoadDepartments: 0,
        lowLoadDepartments: 0,
        idleDepartments: 0,
      };
    } finally {
      departmentLoading.value = false;
    }
  };

  // 获取医生收入排行
  const fetchDoctorIncomeRank = async () => {
    doctorLoading.value = true;
    try {
      const res = await getDoctorIncomeRank({
        timeRange: timeRange.value,
        limit: doctorIncomeRankLimit.value,
      });
      doctorIncomeRankData.value = res.data.rankList;
    } catch (error) {
      console.error('获取医生收入排行失败:', error);
      Message.error(`${t('dataStatistics.loadError')}: 医生收入排行`);
    } finally {
      doctorLoading.value = false;
    }
  };

  // 获取医生就诊量排行
  const fetchDoctorVisitRank = async () => {
    doctorLoading.value = true;
    try {
      const res = await getDoctorVisitRank({
        timeRange: timeRange.value,
        limit: doctorVisitRankLimit.value,
      });
      doctorVisitRankData.value = res.data.rankList;
    } catch (error) {
      console.error('获取医生就诊量排行失败:', error);
      Message.error(`${t('dataStatistics.loadError')}: 医生就诊量排行`);
    } finally {
      doctorLoading.value = false;
    }
  };

  // 获取医生预约率统计
  const fetchDoctorAppointmentRate = async () => {
    doctorLoading.value = true;
    try {
      const res = await getDoctorAppointmentRate({
        timeRange: timeRange.value,
      });
      doctorAppointmentRateData.value = res.data.rateList;
    } catch (error) {
      console.error('获取医生预约率统计失败:', error);
      Message.error(`${t('dataStatistics.loadError')}: 医生预约率统计`);
    } finally {
      doctorLoading.value = false;
    }
  };

  // 导出数据
  const handleExport = async () => {
    exportLoading.value = true;
    try {
      const res = await exportDashboardData({
        timeRange: timeRange.value,
        rankLimit: Math.max(
          departmentRankLimit.value,
          doctorIncomeRankLimit.value,
          doctorVisitRankLimit.value
        ),
      });
      const url = (res.data || '').toString();
      if (!url) {
        throw new Error('empty export url');
      }

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();

      Message.success(t('dataStatistics.exportSuccess'));
    } catch (error) {
      console.error('导出数据失败:', error);
      Message.error(t('dataStatistics.exportFailed'));
    } finally {
      exportLoading.value = false;
    }
  };

  // 时间范围变化处理
  const handleTimeRangeChange = () => {
    fetchAppointmentStatistics();
    fetchAppointmentTrend();
    fetchDepartmentRank();
    fetchDoctorIncomeRank();
    fetchDoctorVisitRank();
    fetchDoctorAppointmentRate();
  };

  // 加载所有数据
  const loadAllData = () => {
    fetchAppointmentStatistics();
    fetchAppointmentTrend();
    fetchDepartmentRank();
    fetchDepartmentLoad();
    fetchDoctorIncomeRank();
    fetchDoctorVisitRank();
    fetchDoctorAppointmentRate();
  };

  onMounted(() => {
    loadAllData();
  });
</script>

<style scoped lang="less">
  .data-statistics-container {
    padding: 20px;
    background: var(--color-bg-1);
    min-height: calc(100vh - 100px);
  }

  .time-range-selector {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .section-card {
    margin-bottom: 20px;
    background: var(--color-bg-2);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    :deep(.arco-card-header) {
      font-size: 18px;
      font-weight: 600;
      border-bottom: 1px solid var(--color-border-2);
    }
  }

  .chart-container {
    margin-top: 30px;

    &:first-child {
      margin-top: 20px;
    }
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .chart-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-1);
    margin: 0 0 16px 0;
  }

  :deep(.arco-statistic) {
    text-align: center;
    padding: 20px;
    background: var(--color-fill-1);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .arco-statistic-title {
      font-size: 14px;
      color: var(--color-text-2);
      margin-bottom: 8px;
    }

    .arco-statistic-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .arco-statistic-value {
      font-size: 28px;
      font-weight: 600;
    }

    .arco-icon {
      font-size: 24px;
    }
  }

  @media (max-width: 768px) {
    .data-statistics-container {
      padding: 10px;
    }

    .time-range-selector {
      justify-content: center;
    }

    :deep(.arco-statistic) {
      padding: 10px;

      .arco-statistic-value {
        font-size: 20px;
      }

      .arco-icon {
        font-size: 18px;
      }
    }
  }
</style>
