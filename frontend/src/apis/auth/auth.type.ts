export interface IAuth {
  username: string;
  password: string;
}

export interface IAuthUser {
  id: number | string;
  username?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  department?: {
    id: string | number;
    name: string;
  } | null;
  position?: {
    id: string | number;
    name: string;
  } | null;
  roles?: string[];
}

export interface IAuthResponse {
  user: IAuthUser | null;
  accessToken?: string;
  refreshToken?: string;
}
