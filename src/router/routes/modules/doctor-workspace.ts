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
    permission: 'CHECK_DOCTOR',
    icon: 'icon-dashboard',
    order: 2,
    hideInMenu: false,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'DoctorWorkspaceIndex',
      component: () => import('@/views/doctor-workspace/index.vue'),
      meta: {
        locale: 'menu.doctorWorkspace',
        requiresPerm: true,
        permission: 'CHECK_DOCTOR',
        activeMenu: 'DoctorWorkspace',
      },
    },
  ],
};

export default DOCTOR_WORKSPACE;
