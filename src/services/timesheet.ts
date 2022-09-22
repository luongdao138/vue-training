import client from '@/services/client';
import { useTimeSheet } from '@/stores/timesheet';
export interface TimeSheetParams {
  from: string;
  to: string;
}

export const getTimeSheet = async (params: TimeSheetParams): Promise<any> => {
  useTimeSheet().$patch({ loading: true });
  const res = await client.get<any>(`/timesheet`, { params });
  return res.data;
};

// GET
// product -> index

// POST
// product -> insert

// GET
// product/{id} -> detail

// PUT
// product/{id} -> update

// DEL
// product/{id} -> delete
