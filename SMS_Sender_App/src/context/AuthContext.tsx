import { createContext, useContext, useEffect, useState } from "react";
import { AppSettingApiService } from "../service/AppSettingApiService";
import { AppSettingResponse } from "../types/appSetting";

type User = {
  id: number;
  name: string;
  role: string;
  change_password: number;
  is_active: number;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
  appSetting: AppSettingResponse | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
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
      const isSetupComplete = !!(
        data.smsApiKey &&
        data.senderId &&
        data.orgName
      );
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
