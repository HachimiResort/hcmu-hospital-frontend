import axios from 'axios';
import { listData } from '@/types/global';

const base = '/schedule-requests';

export interface ScheduleRequestListDTO {
  requestId: number;
  doctorUserId: number;
  scheduleId: number;
  requestType: number;
  status: number;
  targetDate?: string;
  targetSlotPeriod?: number;
  targetSlotType?: number;
  extraSlots?: number;
  reason?: string;
  approverUserId?: number;
  approveRemark?: string;
  approveTime?: string;
  createTime: string;
  scheduleDate?: string;
  slotPeriod?: number;
  slotType?: number;
  doctorName?: string;
}

export interface ScheduleRequestCreateDTO {
  doctorUserId: number;
  scheduleId: number;
  requestType: number;
  targetDate?: string;
  targetSlotPeriod?: number;
  targetSlotType?: number;
  extraSlots?: number;
  reason?: string;
}

export interface ScheduleRequestQueryDTO {
  pageNum?: number;
  pageSize?: number;
  doctorUserId?: number;
  scheduleId?: number;
  requestType?: number;
  status?: number;
}

export function createScheduleRequest(params: ScheduleRequestCreateDTO) {
  return axios.post(`${base}`, params);
}

export function getScheduleRequests(params: ScheduleRequestQueryDTO) {
  return axios.get<listData<ScheduleRequestListDTO>>(`${base}`, { params });
}

export function cancelScheduleRequest(requestId: number) {
  return axios.post<string>(`${base}/${requestId}/cancel`);
}
