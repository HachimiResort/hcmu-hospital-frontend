import axios from 'axios';

const base = '/dashboard';

// ======================== 时间范围枚举 ========================
export type TimeRange = 'ALL' | 'MONTH' | 'WEEK' | 'DAY';

// ======================== 号源大屏接口 ========================

// 号源统计请求参数
export interface AppointmentStatisticsDTO {
  timeRange: TimeRange;
}

// 号源统计响应
export interface AppointmentStatisticsVO {
  pendingPaymentCount: number; // 待支付数量
  bookedCount: number; // 已预约数量
  completedCount: number; // 已完成数量
  cancelledCount: number; // 已取消数量
  noShowCount: number; // 爽约数量
  totalRevenue: number; // 总收入
}

// 预约趋势请求参数
export interface AppointmentTrendDTO {
  timeRange: TimeRange;
}

// 趋势数据点
export interface TrendDataPoint {
  periodLabel: string; // 时段标签
  count: number; // 数量
}

// 预约趋势响应
export interface AppointmentTrendVO {
  trendData: TrendDataPoint[];
}

/**
 * 获取号源统计
 */
export function getAppointmentStatistics(params: AppointmentStatisticsDTO) {
  return axios.get<AppointmentStatisticsVO>(`${base}/appointments/statistics`, {
    params,
  });
}

/**
 * 获取时段-预约量曲线图
 */
export function getAppointmentTrend(params: AppointmentTrendDTO) {
  return axios.get<AppointmentTrendVO>(`${base}/appointments/trend`, {
    params,
  });
}

// ======================== 科室大屏接口 ========================

// 科室预约排行请求参数
export interface AppointmentRankDTO {
  timeRange: TimeRange;
  limit: number;
}

// 科室预约排行项
export interface AppointmentRankItemVO {
  rank: number; // 排名
  departmentId: number; // 科室ID
  departmentName: string; // 科室名称
  appointmentCount: number; // 预约数量
}

// 科室预约排行响应
export interface AppointmentRankVO {
  rankList: AppointmentRankItemVO[];
}

// 科室信息
export interface DepartmentInfoVO {
  departmentId: number;
  departmentName: string;
}

// 科室负荷统计响应
export interface LoadStatisticsVO {
  totalDepartments: number; // 总科室数
  highLoadDepartments: number; // 高负荷科室数
  mediumLoadDepartments: number; // 中负荷科室数
  lowLoadDepartments: number; // 低负荷科室数
  idleDepartments: number; // 空闲科室数
  highLoadDepartmentList: DepartmentInfoVO[]; // 高负荷科室列表
  mediumLoadDepartmentList: DepartmentInfoVO[]; // 中负荷科室列表
  lowLoadDepartmentList: DepartmentInfoVO[]; // 低负荷科室列表
  idleDepartmentList: DepartmentInfoVO[]; // 空闲科室列表
}

/**
 * 获取科室预约排行
 */
export function getDepartmentAppointmentRank(params: AppointmentRankDTO) {
  return axios.get<AppointmentRankVO>(`${base}/departments/appointment-rank`, {
    params,
  });
}

/**
 * 获取科室负荷统计
 */
export function getDepartmentLoad() {
  return axios.get<LoadStatisticsVO>(`${base}/departments/department-load`);
}

// ======================== 医生大屏接口 ========================

// 医生预约率请求参数
export interface DoctorAppointmentRateDTO {
  timeRange: TimeRange;
}

// 医生预约率项
export interface DoctorAppointmentRateItemVO {
  doctorUserId: number; // 医生用户ID
  doctorName: string; // 医生姓名
  completedCount: number; // 完成数量
  cancelledCount: number; // 取消数量
  noShowCount: number; // 爽约数量
  completedRate: number; // 完成率
  cancelledRate: number; // 取消率
  noShowRate: number; // 爽约率
}

// 医生预约率响应
export interface DoctorAppointmentRateVO {
  rateList: DoctorAppointmentRateItemVO[];
}

// 医生收入排行请求参数
export interface DoctorIncomeRankDTO {
  timeRange: TimeRange;
  limit: number;
}

// 医生收入排行项
export interface DoctorIncomeRankItemVO {
  rank: number; // 排名
  doctorUserId: number; // 医生用户ID
  doctorName: string; // 医生姓名
  totalIncome: number; // 总收入
}

// 医生收入排行响应
export interface DoctorIncomeRankVO {
  rankList: DoctorIncomeRankItemVO[];
}

// 医生就诊量排行请求参数
export interface DoctorVisitRankDTO {
  timeRange: TimeRange;
  limit: number;
}

// 医生就诊量排行项
export interface DoctorVisitRankItemVO {
  rank: number; // 排名
  doctorUserId: number; // 医生用户ID
  doctorName: string; // 医生姓名
  visitCount: number; // 就诊量
}

// 医生就诊量排行响应
export interface DoctorVisitRankVO {
  rankList: DoctorVisitRankItemVO[];
}

/**
 * 获取医生预约率统计
 */
export function getDoctorAppointmentRate(params: DoctorAppointmentRateDTO) {
  return axios.get<DoctorAppointmentRateVO>(
    `${base}/doctors/appointment-rate`,
    {
      params,
    }
  );
}

/**
 * 获取医生收入排行
 */
export function getDoctorIncomeRank(params: DoctorIncomeRankDTO) {
  return axios.get<DoctorIncomeRankVO>(`${base}/doctors/income-rank`, {
    params,
  });
}

/**
 * 获取医生就诊量排行
 */
export function getDoctorVisitRank(params: DoctorVisitRankDTO) {
  return axios.get<DoctorVisitRankVO>(`${base}/doctors/visit-rank`, {
    params,
  });
}
