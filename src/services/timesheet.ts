import client from '@/services/client';


export interface TimeSheetParams {
  from: string;
  to: string;
}

export const getTimeSheet = async (
  params: TimeSheetParams
): Promise<any> => {
  const res = await client.get<any>(`/timesheet`, { params });
  console.log(res.data);

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

