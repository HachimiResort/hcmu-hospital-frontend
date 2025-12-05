import axios from 'axios';

const base = '/common';

export type TimeRange = 'ALL' | 'MONTH' | 'WEEK' | 'DAY';

export interface DashboardExportDTO {
  timeRange: TimeRange;
  rankLimit: number;
}

export function exportDashboardData(params: DashboardExportDTO) {
  return axios.post<string>(`${base}/export-dashboard`, {
    params,
  });
}
