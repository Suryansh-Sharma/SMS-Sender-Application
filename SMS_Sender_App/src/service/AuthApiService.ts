import { ResetPasswordPayload, ResetPasswordResponse } from "../types/auth";

export const AuthApiService = {
  login: async (username: string, password: string) => {
    const res = await window.api.login({ username, password });
    if (!res.success) {
      throw new Error(res.message || "Login Failed");
    }
    return res;
  },
  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<ResetPasswordResponse> => {
    const res = await window.api.resetPassword(payload);
    if (!res.success) {
      throw new Error(res.message || "Unable to reset password");
    }
    return res;
  },
};
