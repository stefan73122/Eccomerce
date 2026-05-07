import api from '@/lib/axios';
import { Region } from '@/types';

interface RegionsEnvelope {
  status: string;
  data: Region[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export const regionService = {
  getRegions: async (): Promise<Region[]> => {
    const response = await api.get<RegionsEnvelope>('/api/regions', {
      params: { page: 1, limit: 100 },
    });
    return response.data.data ?? [];
  },
};
