import {
  CreateUserPayload,
  CreateUserResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
} from "../types/auth";

export const UserApiService = {
  getAll: async () => {
    return await window.api.getAll();
  },
  createNewUser: async (
    payload: CreateUserPayload,
  ): Promise<CreateUserResponse> => {
    const res = await window.api.createNewUser(payload);

    if (!res.success) {
      throw new Error(res.message || "Unable to create user");
    }
    return res;
  },
  updatePassword: async (
    payload: UpdatePasswordPayload,
  ): Promise<UpdatePasswordResponse> => {
    const res = await window.api.updatePassword(payload);
    if (!res.success) {
      throw new Error(res.message || "Unable to update password.");
    }
    return res;
  },
};
