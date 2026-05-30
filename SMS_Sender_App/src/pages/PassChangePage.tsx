import { LockOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, message, Typography } from "antd";
import { useState } from "react";
import { LoadingComponent } from "../component/LoadingComponent";
import { useAuth } from "../context/AuthContext";
import { UserApiService } from "../service/UserApiService";
import { UpdatePasswordPayload } from "../types/auth";

const { Title, Text } = Typography;

function PassChangePage() {
  const { user, logout } = useAuth();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword != values.confirmPassword) {
      return message.error("New Password and Confirm Password must be same.");
    }
    if (!user) {
      return logout();
    }
    try {
      setLoading(true);
      const payLoad: UpdatePasswordPayload = {
        username: user.name,
        password: values.oldPassword,
        newPassword: values.newPassword,
      };
      await UserApiService.updatePassword(payLoad);
      message.success("Password updated successfully");
      logout();
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message);
      } else {
        message.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingComponent text="Please wait" />;
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg rounded-3xl shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl mb-4">
            <LockOutlined />
          </div>

          <Title level={3} className="mb-1!">
            Change Password
          </Title>

          <Text type="secondary">Update your login password securely</Text>
        </div>

        {/* User Info */}
        <Alert
          message={`Logged in as ${user?.name}`}
          type="info"
          showIcon
          className="mb-6"
        />

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Current Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please enter current password",
              },
            ]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please enter new password",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm password",
              },

              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter new password" />
          </Form.Item>

          {/* Password Tips */}
          <div className="mb-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Password should contain:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button>Cancel</Button>

            <Button type="primary" htmlType="submit">
              Update Password
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default PassChangePage;
