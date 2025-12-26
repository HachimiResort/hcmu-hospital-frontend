import { DEFAULT_LAYOUT } from '@/router/routes/base';
import { AppRouteRecordRaw } from '../types';

const DOCTOR_WORKSPACE: AppRouteRecordRaw = {
  path: '/doctor-workspace',
  name: 'DoctorWorkspace',
  component: DEFAULT_LAYOUT,
  redirect: '/doctor-workspace/index',
  meta: {
    locale: 'menu.doctorWorkspace',
    requiresPerm: true,
    permission: 'DOCTOR_WORK_PAGE',
    icon: 'icon-dashboard',
    order: 2,
    hideInMenu: false,
    hideChildrenInMenu: false,
  },
  children: [
    {
      path: 'index',
      name: 'DoctorWorkspaceIndex',
      component: () => import('@/views/doctor-workspace/index.vue'),
      meta: {
        locale: 'menu.doctorWorkspace',
        requiresPerm: true,
        permission: 'DOCTOR_WORK_PAGE',
        activeMenu: 'DoctorWorkspace',
      },
    },
    {
      path: 'schedule-patients/schedules/:scheduleId/patients/:userId',
      name: 'SchedulePatients',
      component: () => import('@/views/doctor-workspace/schedule-patients.vue'),
      meta: {
        locale: 'menu.schedulePatients',
        requiresPerm: false,
        hideInMenu: true,
        activeMenu: 'DoctorWorkspace',
      },
    },
    {
      path: 'schedule-requests',
      name: 'DoctorScheduleRequests',
      component: () =>
        import('@/views/doctor-workspace/schedule-request-list.vue'),
      meta: {
        locale: 'menu.scheduleRequestList',
        requiresPerm: true,
        permission: 'DOCTOR_WORK_PAGE',
        activeMenu: 'DoctorWorkspace',
      },
    },
  ],
};

export default DOCTOR_WORKSPACE;
