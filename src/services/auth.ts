import client from './client';

export interface Pivot {
  user_id: number;
  role_id: number;
}

export interface Role {
  id: number;
  name: string;
  pivot: Pivot;
}

export interface AuthUser {
  id: number;
  member_code: string;
  manage_id: number;
  name: string;
  email: string;
  phone: string;
  skype: string;
  status: number;
  user_name: string;
  grant: number;
  member_id: null;
  group_team: number;
  start_work: Date;
  official_date: Date;
  end_work: Date;
  update: Date;
  update_by: string;
  notify_email: number;
  birthday: Date;
  cv_url: null;
  member_code_old: null;
  open_request: number;
  checkin_setting: string;
  checkout_setting: string;
  avatar: string;
  avatar_img: string;
  roles: Role[];
  department: {
    id: number;
    value: string;
  };
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
  };
}

export interface GetCurrentUserResponse {
  data: AuthUser;
  success: boolean;
  message: string;
}

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  console.log({ baseURL: import.meta.env.VITE_SERVER_URL });
  const res = await client.post<LoginResponse>('/auth/login', params);
  return res.data;
};

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  const res = await client.get<GetCurrentUserResponse>('/auth/current-user');
  return res.data;
};
