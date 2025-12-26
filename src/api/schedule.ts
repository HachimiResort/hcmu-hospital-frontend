import axios from 'axios';
import { listData } from '@/types/global';

const base = '/schedules';

// 排班列表项
export interface ScheduleListDTO {
  scheduleId: number;
  doctorUserId: number;
  scheduleDate: string;
  slotType: number;
  slotPeriod: number;
  totalSlots: number;
  availableSlots: number;
  fee: number;
  status: number;
  createTime: string;
}

// 获取排班请求参数
export interface ScheduleGetRequestDTO {
  [key: string]: string | number | undefined;
  pageNum?: number;
  pageSize?: number;
  doctorUserId?: number;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  slotType?: number;
  slotPeriod?: number;
  status?: number;
}

// 创建排班参数
export interface ScheduleCreateDTO {
  doctorUserId: number;
  scheduleDate: string;
  slotType: number;
  slotPeriod: number;
  totalSlots: number;
  fee: number;
  status: number;
}

// 更新排班参数
export interface ScheduleUpdateDTO {
  doctorUserId?: number;
  scheduleDate?: string;
  slotType?: number;
  slotPeriod?: number;
  totalSlots?: number;
  availableSlots?: number;
  fee?: number;
  status?: number;
}

// 复制排班参数
export interface ScheduleCopyDTO {
  doctorUserId: number;
  targetDate: string;
}

/**
 * 查询排班列表
 * @param requestDTO ScheduleGetRequestDTO
 * @returns
 */
export function getAllSchedules(requestDTO: ScheduleGetRequestDTO) {
  let url = `${base}?`;

  Object.keys(requestDTO).forEach((key) => {
    if (requestDTO[key] !== undefined && requestDTO[key] !== '') {
      url += `${key}=${encodeURIComponent(requestDTO[key] as string)}&`;
    }
  });

  // 移除最后一个&符号
  url = url.slice(0, -1);

  return axios.get<listData<ScheduleListDTO>>(url);
}

/**
 * 创建排班('ADD_SCHEDULE')
 * @param params ScheduleCreateDTO
 * @returns
 */
export function createSchedule(params: ScheduleCreateDTO) {
  return axios.post<ScheduleListDTO>(`${base}`, params);
}

/**
 * 根据ID获取排班详情
 * @param scheduleId
 * @returns
 */
export function getScheduleById(scheduleId: number) {
  return axios.get<ScheduleListDTO>(`${base}/${scheduleId}`);
}

/**
 * 根据ID更新排班('ALT_SCHEDULE')
 * @param scheduleId
 * @param params ScheduleUpdateDTO
 * @returns
 */
export function updateSchedule(scheduleId: number, params: ScheduleUpdateDTO) {
  return axios.put<string>(`${base}/${scheduleId}`, params);
}

/**
 * 删除排班('DEL_SCHEDULE')
 * @param scheduleId
 * @returns
 */
export function deleteSchedule(scheduleId: number) {
  return axios.delete<string>(`${base}/${scheduleId}`);
}

/**
 * 批量删除排班('DEL_SCHEDULE')
 * @param scheduleIds
 * @returns
 */
export function batchDeleteSchedules(scheduleIds: number[]) {
  return axios.delete<string>(`${base}/batch`, { data: scheduleIds });
}

/**
 * 复制7天前的排班('ADD_SCHEDULE')
 * @param params ScheduleCopyDTO
 * @returns
 */
export function copySchedule(params: ScheduleCopyDTO) {
  return axios.post<string>(`${base}/copy`, params);
}

/**
 * 紧急为患者预约排班号源
 * @param scheduleId 排班ID
 * @param patientUserId 患者用户ID
 */
export function emergencyAppointSchedule(
  scheduleId: number,
  patientUserId: number
) {
  return axios.post(`${base}/${scheduleId}/emergency-appoint/`, null, {
    params: { patientUserId },
  });
}
