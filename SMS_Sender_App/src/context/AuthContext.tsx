import { useEffect, useState, type ReactNode } from "react";
import { AppSettingApiService } from "../service/AppSettingApiService";
import type { AppSettingResponse } from "../types/appSetting";
import { AuthContext, type User } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appSetting, setAppSetting] = useState<AppSettingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const checkIsAppSettingPresent = async () => {
    try {
      const res = await AppSettingApiService.getApplicationSetting();
      if (!res.success || !res.data) {
        setAppSetting(null);
        return;
      }
      const data = res.data;
      const isSetupComplete = !!(data.smsApiKey && data.senderId && data.orgName);
      if (!isSetupComplete) {
        setAppSetting(null);
        return;
      }
      setAppSetting(data);
    } catch (error) {
      console.log(error);
      setAppSetting(null);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
        await checkIsAppSettingPresent();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, appSetting }}>
      {children}
    </AuthContext.Provider>
  );
};
