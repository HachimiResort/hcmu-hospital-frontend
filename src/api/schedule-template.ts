import axios from 'axios';
import { listData } from '@/types/global';

const base = '/schedule-templates';

// 模板列表项
export interface TemplateListDTO {
  templateId: number;
  templateName: string;
  createTime: string;
  updateTime: string;
}

export interface TemplateGetRequestDTO extends Record<string, unknown> {
  pageNum?: number;
  pageSize?: number;
  templateName?: string;
}

export interface TemplateCreateDTO {
  templateName: string;
}

export interface TemplateUpdateDTO {
  templateName?: string;
}

// 模板下的排班
export interface TemplateScheduleListDTO {
  scheduleId: number;
  templateId: number;
  slotType: number;
  totalSlots: number;
  weekday: number;
  slotPeriod: number;
  fee: number;
  createTime: string;
  updateTime: string;
}

export interface TemplateScheduleGetRequestDTO extends Record<string, unknown> {
  pageNum?: number;
  pageSize?: number;
  slotType?: number;
  slotPeriod?: number;
  weekday?: number;
}

export interface TemplateScheduleCreateDTO {
  slotType: number;
  totalSlots: number;
  slotPeriod: number;
  fee: number;
  weekday: number;
}

export interface TemplateScheduleUpdateDTO {
  slotType?: number;
  totalSlots?: number;
  slotPeriod?: number;
  fee?: number;
  weekday?: number;
}

function buildQuery(url: string, params: Record<string, unknown>) {
  let query = `${url}?`;
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== '') {
      query += `${key}=${encodeURIComponent(value as string)}&`;
    }
  });
  return query.endsWith('&') || query.endsWith('?')
    ? query.slice(0, -1)
    : query;
}

export function getAllTemplates(requestDTO: TemplateGetRequestDTO) {
  const url = buildQuery(base, requestDTO);
  return axios.get<listData<TemplateListDTO>>(url);
}

export function createTemplate(params: TemplateCreateDTO) {
  return axios.post<TemplateListDTO>(base, params);
}

export function updateTemplate(templateId: number, params: TemplateUpdateDTO) {
  return axios.put<string>(`${base}/${templateId}`, params);
}

export function deleteTemplate(templateId: number) {
  return axios.delete<string>(`${base}/${templateId}`);
}

export function getTemplateById(templateId: number) {
  return axios.get<TemplateListDTO>(`${base}/${templateId}`);
}

export function getTemplateSchedules(
  templateId: number,
  requestDTO: TemplateScheduleGetRequestDTO
) {
  const url = buildQuery(`${base}/${templateId}/schedules`, requestDTO);
  return axios.get<listData<TemplateScheduleListDTO>>(url);
}

export function createTemplateSchedule(
  templateId: number,
  params: TemplateScheduleCreateDTO
) {
  return axios.post<TemplateScheduleListDTO>(
    `${base}/${templateId}/schedules`,
    params
  );
}

export function updateTemplateSchedule(
  templateId: number,
  scheduleId: number,
  params: TemplateScheduleUpdateDTO
) {
  return axios.put<string>(
    `${base}/${templateId}/schedules/${scheduleId}`,
    params
  );
}

export function deleteTemplateSchedule(templateId: number, scheduleId: number) {
  return axios.delete<string>(`${base}/${templateId}/schedules/${scheduleId}`);
}

export function getTemplateScheduleById(
  templateId: number,
  scheduleId: number
) {
  return axios.get<TemplateScheduleListDTO>(
    `${base}/${templateId}/schedules/${scheduleId}`
  );
}
