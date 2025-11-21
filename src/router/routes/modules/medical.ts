import { DEFAULT_LAYOUT } from '@/router/routes/base';
import { AppRouteRecordRaw } from '../types';

const MEDICAL: AppRouteRecordRaw = {
  path: '/medical',
  name: 'Medical',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.medical',
    requiresPerm: false,
    icon: 'icon-common',
    order: 7,
  },
  children: [
    {
      path: 'department-page',
      name: 'MedicalDepartmentPage',
      component: () => import('@/views/system/department-page/index.vue'),
      meta: {
        locale: 'menu.medical.departmentPage',
        requiresPerm: true,
        permission: 'DEPART_MG_PAGE',
      },
    },
    {
      path: 'doctor-profile-page',
      name: 'MedicalDoctorProfilePage',
      component: () => import('@/views/system/doctor-profile-page/index.vue'),
      meta: {
        locale: 'menu.medical.doctorProfilePage',
        requiresPerm: true,
        permission: 'DOCTOR_MG_PAGE',
      },
    },
    {
      path: 'operation-rule-page',
      name: 'MedicalOperationRulePage',
      component: () => import('@/views/system/operation-rule-page/index.vue'),
      meta: {
        locale: 'menu.medical.operationRulePage',
        requiresPerm: true,
        permission: 'RULE_MG_PAGE',
      },
    },
    {
      path: 'patient-profile-page',
      name: 'MedicalPatientProfilePage',
      component: () => import('@/views/system/patient-profile-page/index.vue'),
      meta: {
        locale: 'menu.medical.patientProfilePage',
        requiresPerm: true,
        permission: 'PATIENT_MG_PAGE',
      },
    },
    {
      path: 'schedule-page',
      name: 'MedicalSchedulePage',
      component: () => import('@/views/system/schedule-page/index.vue'),
      meta: {
        locale: 'menu.medical.schedulePage',
        requiresPerm: true,
        permission: 'SCHEDULE_MG_PAGE',
      },
    },
    {
      path: 'schedule-template-page',
      name: 'MedicalScheduleTemplatePage',
      component: () =>
        import('@/views/system/schedule-template-page/index.vue'),
      meta: {
        locale: 'menu.medical.scheduleTemplatePage',
        requiresPerm: true,
        permission: 'TEMPLATE_MG_PAGE',
      },
    },
  ],
};

export default MEDICAL;
