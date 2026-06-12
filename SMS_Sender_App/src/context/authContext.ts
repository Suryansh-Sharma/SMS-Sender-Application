import { createContext } from "react";
import type { AppSettingResponse } from "../types/appSetting";
import type { User } from "../types/auth";

export type { User };

export type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
  appSetting: AppSettingResponse | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);
