import axios from 'axios';
import { listData } from '@/types/global';

const base = '/doctor-profiles';

// 医生档案列表项
export interface DoctorProfileListDTO {
  doctorProfileId: number;
  userId: number;
  userName: string;
  name: string;
  departmentId: number;
  locationId: number;
  roomCode: string;
  locationName: string;
  departmentName: string;
  title: string;
  specialty: string;
  createTime: string;
}

// 医生档案详情
export interface DoctorProfileDetailDTO {
  doctorProfileId: number;
  userId: number;
  userName: string;
  name: string;
  departmentId: number;
  locationId: number;
  roomCode: string;
  locationName: string;
  departmentName: string;
  title: string;
  specialty: string;
  bio: string;
  createTime: string;
  updateTime: string;
}

// 获取医生档案请求参数
export interface DoctorProfileGetRequestDTO {
  [key: string]: string | number | undefined;
  pageNum?: number;
  pageSize?: number;
  departmentId?: number;
  title?: string;
  isDeleted?: number;
}

// 创建医生档案参数
export interface DoctorProfileCreateDTO {
  userId?: number;
  departmentId?: number;
  locationId?: number;
  title?: string;
  specialty?: string;
  bio?: string;
}

// 更新医生档案参数
export interface DoctorProfileUpdateDTO {
  departmentId?: number;
  locationId?: number;
  title?: string;
  specialty?: string;
  bio?: string;
}

// 时段患者列表项
export interface SchedulePatientDTO {
  userId: number;
  userName: string;
  name: string;
  sex: string;
  email: string;
  phone: string;
}

// 医生排班列表项
export interface DoctorScheduleDTO {
  scheduleId: number;
  scheduleDate: string;
  slotPeriod: number;
  slotType: number;
  totalSlots: number;
  availableSlots: number;
  status: number;
}

// 医生排班查询参数
export interface DoctorScheduleQueryDTO {
  scheduleStartDate: string;
  scheduleEndDate: string;
  pageNum?: number;
  pageSize?: number;
}

// 医生排班列表响应
export interface DoctorScheduleListDTO {
  list: DoctorScheduleDTO[];
  total: number;
}

/**
 * 查询医生档案列表
 * @param requestDTO DoctorProfileGetRequestDTO
 * @returns
 */
export function getAllDoctorProfiles(requestDTO: DoctorProfileGetRequestDTO) {
  let url = `${base}?`;

  Object.keys(requestDTO).forEach((key) => {
    if (requestDTO[key] !== undefined && requestDTO[key] !== '') {
      url += `${key}=${encodeURIComponent(requestDTO[key] as string)}&`;
    }
  });

  // 移除最后一个&符号
  url = url.slice(0, -1);

  return axios.get<listData<DoctorProfileListDTO>>(url);
}

/**
 * 创建医生档案('DOCTOR_MANAGE')
 * @param params DoctorProfileCreateDTO
 * @returns
 */
export function createDoctorProfile(params: DoctorProfileCreateDTO) {
  return axios.post<DoctorProfileListDTO>(`${base}`, params);
}

/**
 * 根据用户ID获取医生档案详情
 * @param userId
 * @returns
 */
export function getDoctorProfileByUserId(userId: number) {
  return axios.get<DoctorProfileDetailDTO>(`${base}/${userId}`);
}

/**
 * 根据用户ID更新医生档案('ALT_DOCTOR')
 * @param userId
 * @param params DoctorProfileUpdateDTO
 * @returns
 */
export function updateDoctorProfile(
  userId: number,
  params: DoctorProfileUpdateDTO
) {
  return axios.put<string>(`${base}/${userId}`, params);
}

/**
 * 删除医生档案('DOCTOR_MANAGE')
 * @param doctorProfileId
 * @returns
 */
export function deleteDoctorProfile(doctorProfileId: number) {
  return axios.delete<string>(`${base}/${doctorProfileId}`);
}

/**
 * 批量删除医生档案('DOCTOR_MANAGE')
 * @param doctorProfileIds
 * @returns
 */
export function batchDeleteDoctorProfiles(doctorProfileIds: number[]) {
  return axios.delete<string>(`${base}/batch`, { data: doctorProfileIds });
}

/**
 * 更新当前登录医生档案（仅允许修改个人字段）
 * @param params DoctorProfileUpdateDTO
 */
export function updateDoctorProfileSelf(params: DoctorProfileUpdateDTO) {
  return axios.put<string>(`${base}/self`, params);
}

/**
 * 查询排班下的患者列表
 * @param userId 医生用户ID
 * @param scheduleId 排班ID
 */
export function getSchedulePatients(userId: number, scheduleId: number) {
  return axios.get<SchedulePatientDTO[]>(
    `${base}/${userId}/schedules/${scheduleId}/patients`
  );
}

/**
 * 查询医生排班列表
 * @param userId 医生用户ID
 * @param params DoctorScheduleQueryDTO
 */
export function getDoctorSchedules(
  userId: number,
  params: DoctorScheduleQueryDTO
) {
  return axios.get<DoctorScheduleListDTO>(`${base}/${userId}/schedules`, {
    params,
  });
}

/**
 * 医生周排班导入参数
 */
export interface DoctorScheduleImportDTO {
  scheduleDate: string; // date format: YYYY-MM-DD, determines which week
  templateId: number; // template to import from
}

/**
 * 从模板导入医生周排班('ADD_SCHEDULE')
 * @param userId 医生用户ID
 * @param params DoctorScheduleImportDTO
 * @returns
 */
export function importScheduleFromTemplate(
  userId: number,
  params: DoctorScheduleImportDTO
) {
  return axios.post<string>(`${base}/${userId}/schedules`, params);
}
