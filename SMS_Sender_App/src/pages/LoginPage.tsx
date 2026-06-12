import {
  LockOutlined,
  LoginOutlined,
  ThunderboltFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, message, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AuthApiService } from "../service/AuthApiService";

const { Title, Text } = Typography;

export const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await AuthApiService.login(values.username, values.password);
      if (res.user) login(res.user);
      navigate("/");
      //   console.log(res);
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-110">
        {/* Logo / Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4 text-white text-2xl">
            <ThunderboltFilled />
          </div>
          <Title level={2} className="m-0 font-black! tracking-tight">
            Welcome back
          </Title>
          <Text className="text-slate-500 font-medium">
            Please enter your details to sign in
          </Text>
        </div>

        {/* Login Card */}
        <Card className="rounded-4xl border-none shadow-2xl shadow-slate-200/60 p-2 md:p-4">
          <Form
            name="login_form"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            autoComplete="off"
            requiredMark={false}
          >
            {/* Username Field */}
            <Form.Item
              label={
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Username
                </span>
              }
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-300 mr-2" />}
                placeholder="john doe"
                className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-400"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label={
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </span>
              }
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-300 mr-2" />}
                placeholder="••••••••"
                className="rounded-xl border-slate-200"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                icon={<LoginOutlined />}
                className="h-12 rounded-xl bg-blue-600 hover:bg-blue-500 border-none font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      <style>{`
        .ant-form-item-label { padding-bottom: 8px !important; }
        .ant-input-affix-wrapper-lg { padding: 10px 16px; }
        .ant-checkbox-checked .ant-checkbox-inner { background-color: #2563eb; border-color: #2563eb; }
      `}</style>
    </div>
  );
};

export default LoginPage;
