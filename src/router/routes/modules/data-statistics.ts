import { DEFAULT_LAYOUT } from '@/router/routes/base';
import { AppRouteRecordRaw } from '../types';

const DATA_STATISTICS: AppRouteRecordRaw = {
  path: '/data-statistics',
  name: 'DataStatistics',
  component: DEFAULT_LAYOUT,
  redirect: '/data-statistics/index',
  meta: {
    locale: 'menu.dataStatistics',
    requiresPerm: true,
    permission: 'MASTER_ROLE',
    icon: 'icon-bar-chart',
    order: 3,
    hideInMenu: false,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'DataStatisticsIndex',
      component: () => import('@/views/data-statistics/index.vue'),
      meta: {
        locale: 'menu.dataStatistics',
        requiresPerm: true,
        permission: 'MASTER_ROLE',
        activeMenu: 'DataStatistics',
      },
    },
  ],
};

export default DATA_STATISTICS;
