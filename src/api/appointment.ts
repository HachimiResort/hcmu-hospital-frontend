import axios from 'axios';
import { listData } from '@/types/global';

const base = '/appointments';

// 预约列表项
export interface AppointmentListDTO {
  appointmentId: number;
  scheduleId: number;
  patientUserId: number;
  patientName?: string;
  registrationFee: number;
  status: number;
  checkInTime?: string;
  createTime?: string;
  updateTime?: string;
}

// 预约详情
export interface AppointmentDetailDTO {
  appointmentId: number;
  scheduleId: number;
  scheduleDate: string;
  slotPeriod: number;
  doctorUserId: number;
  doctorName?: string;
  departmentName?: string;
  patientUserId: number;
  patientName?: string;
  registrationFee: number;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 查询参数
export interface AppointmentGetRequestDTO {
  [key: string]: string | number | undefined;
  pageNum?: number;
  pageSize?: number;
  scheduleId?: number;
  patientUserId?: number;
  doctorUserId?: number;
  status?: number;
}

/**
 * 查询预约列表
 */
export function getAppointments(requestDTO: AppointmentGetRequestDTO) {
  let url = `${base}?`;
  Object.keys(requestDTO).forEach((key) => {
    if (requestDTO[key] !== undefined && requestDTO[key] !== '') {
      url += `${key}=${encodeURIComponent(requestDTO[key] as string)}&`;
    }
  });
  url = url.slice(0, -1);
  return axios.get<listData<AppointmentListDTO>>(url);
}

/**
 * 根据ID获取预约详情
 */
export function getAppointmentById(appointmentId: number) {
  return axios.get<AppointmentDetailDTO>(`${base}/${appointmentId}`);
}

/**
 * 传呼患者
 */
export function callPatient(appointmentId: number) {
  return axios.put<string>(`${base}/${appointmentId}/call`);
}

/**
 * 完成就诊
 */
export function completeAppointment(appointmentId: number) {
  return axios.put<string>(`${base}/${appointmentId}/complete`);
}

/**
 * 标记爽约
 */
export function noShowAppointment(appointmentId: number) {
  return axios.put<string>(`${base}/${appointmentId}/no-show`);
}

/**
 * 获取签到码
 */
export function getCheckInCode(locationId: number) {
  return axios.get<Blob>(`${base}/check-in/token?locationId=${locationId}`, {
    responseType: 'blob',
  });
}
