import axios from 'axios';
import { listData } from '@/types/global';

const base = '/patient-profiles';

// 列表项
export interface PatientProfileListDTO {
  patientProfileId: number;
  userId: number;
  userName: string;
  name: string;
  identityType: number;
  studentTeacherId?: string;
  emergencyContact?: string;
  createTime?: string;
}

// 详情
export interface PatientProfileDetailDTO {
  patientProfileId: number;
  userId: number;
  userName: string;
  name: string;
  identityType: number;
  studentTeacherId?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  allergyHistory?: string;
  createTime?: string;
  updateTime?: string;
}

// 请求参数
export interface PatientProfileGetRequestDTO {
  [key: string]: string | number | undefined;
  pageNum?: number;
  pageSize?: number;
  identityType?: number;
}

// 更新（管理员）
export interface PatientProfileUpdateDTO {
  identityType?: number;
  studentTeacherId?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  allergyHistory?: string;
}

// 患者自更新
export interface PatientProfileUpdateSelfDTO {
  emergencyContact?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  allergyHistory?: string;
}

/**
 * 查询患者档案列表
 */
export function getPatientProfiles(requestDTO: PatientProfileGetRequestDTO) {
  let url = `${base}?`;
  Object.keys(requestDTO).forEach((key) => {
    if (requestDTO[key] !== undefined && requestDTO[key] !== '') {
      url += `${key}=${encodeURIComponent(requestDTO[key] as string)}&`;
    }
  });
  url = url.slice(0, -1);
  return axios.get<listData<PatientProfileListDTO>>(url);
}

/**
 * 根据用户ID获取患者档案详情
 */
export function getPatientProfileByUserId(userId: number) {
  return axios.get<PatientProfileDetailDTO>(`${base}/${userId}`);
}

/**
 * 管理员根据用户ID更新患者档案
 */
export function updatePatientProfile(
  userId: number,
  params: PatientProfileUpdateDTO
) {
  return axios.put<string>(`${base}/${userId}`, params);
}

/**
 * 患者更新自己的档案
 */
export function updateSelfPatientProfile(params: PatientProfileUpdateSelfDTO) {
  return axios.put<string>(`${base}/self`, params);
}
