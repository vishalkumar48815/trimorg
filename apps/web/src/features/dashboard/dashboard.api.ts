import { apiRequest } from '@/lib/api';
import type { DashboardMetrics } from './dashboard.types';

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  return apiRequest<DashboardMetrics>('/dashboard/metrics', {
    method: 'GET',
    auth: true,
  });
}
