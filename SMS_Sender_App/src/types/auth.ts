export type User = {
  id: number;
  name: string;
  role: string;
  change_password: number;
  is_active: number;
};

export type LoginResponse = {
  success: boolean;
  user?: User;
  message?: string;
  requirePasswordChange?: boolean;
  userId: number;
};
export type CreateUserPayload = {
  name: string;
};
export type CreateUserResponse = {
  success: boolean;
  user?: {
    id: number;
    name: string;
    role: string;
  };
  message?: string;
};
export type ResetPasswordPayload = {
  username: string;
};
export type ResetPasswordResponse = {
  success: boolean;
  message?: string;
};
export type UpdatePasswordPayload = {
  username: string;
  password: string;
  newPassword: string;
};
export type UpdatePasswordResponse = {
  success: boolean;
  message?: string;
};
