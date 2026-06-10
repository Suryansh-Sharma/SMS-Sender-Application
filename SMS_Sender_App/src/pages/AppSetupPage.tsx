import {
  ApiOutlined,
  BankOutlined,
  LogoutOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AppSettingApiService } from "../service/AppSettingApiService";
import { AppSettingPayload } from "../types/appSetting";

function AppSetupPage() {
  const { user, logout } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const [fetching, setFetching] = useState(isAdmin);

  useEffect(() => {
    if (!isAdmin) return;
    AppSettingApiService.getApplicationSetting()
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          form.setFieldsValue({
            orgName: d.orgName ?? "",
            orgPhone: d.orgPhone ?? "",
            orgEmail: d.orgEmail ?? "",
            orgAddress: d.orgAddress ?? "",
            smsApiKey: d.smsApiKey ?? "",
            senderId: d.senderId ?? "",
            smsUrl: d.smsUrl ?? "",
            dailySmsLimit: d.dailySmsLimit ?? 1500,
          });
          const hasExisting = !!(d.smsApiKey || d.senderId || d.orgName);
          setIsUpdate(hasExisting);
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [isAdmin, form]);

  const handleSubmit = async (values: AppSettingPayload) => {
    setLoading(true);
    console.log(values);
    try {
      await AppSettingApiService.saveSettings({
        ...values,
        settingsLastUpdatedBy: user?.name,
      });
      message.success(
        isUpdate
          ? "Settings updated successfully. Please log out and sign in again if the application does not refresh automatically."
          : "Setup completed successfully. Please log out and sign in again if the application does not refresh automatically.",
      );
      setTimeout(() => window.location.reload(), 800);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to save settings.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-3xl shadow-xl border-0 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-3xl mb-5">
            <SettingOutlined />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Setup Pending</h1>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed">
            The application is not configured yet. Please contact your
            administrator to complete the setup before using the system.
          </p>
          <Button
            danger
            size="large"
            icon={<LogoutOutlined />}
            className="mt-6 w-full h-11 rounded-xl"
            onClick={logout}
          >
            Logout
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-3xl mb-4">
            <SettingOutlined />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isUpdate ? "Application Settings" : "Initial Setup"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isUpdate
              ? "Review and update your SMS and organization configuration."
              : "Configure SMS credentials and organization details to get started."}
          </p>
        </div>

        <Card className="rounded-3xl shadow-xl border-0" loading={fetching}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark="optional"
            disabled={fetching}
          >
            {/* Organization Section */}
            <div className="flex items-center gap-2 mb-4">
              <BankOutlined className="text-blue-500 text-base" />
              <span className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                Organization Details
              </span>
            </div>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="orgName"
                  label="Organization Name"
                  rules={[
                    {
                      required: true,
                      message: "Organization name is required.",
                    },
                  ]}
                >
                  <Input
                    placeholder="e.g. Acme Corporation"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name="orgPhone" label="Phone Number">
                  <Input
                    placeholder="e.g. 98765 43210"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="orgEmail"
                  label="Email Address"
                  rules={[{ type: "email", message: "Enter a valid email." }]}
                >
                  <Input
                    placeholder="e.g. admin@company.com"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="orgAddress" label="Address">
                  <Input.TextArea
                    placeholder="e.g. 123 Main Street, City, State"
                    rows={2}
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider className="my-5" />

            {/* SMS Configuration Section */}
            <div className="flex items-center gap-2 mb-4">
              <ApiOutlined className="text-green-500 text-base" />
              <span className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                SMS Configuration
              </span>
            </div>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="smsApiKey"
                  label="SMS API Key"
                  rules={[
                    { required: true, message: "SMS API key is required." },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter your SMS provider API key"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="senderId"
                  label="Sender ID"
                  rules={[
                    { required: true, message: "Sender ID is required." },
                  ]}
                >
                  <Input
                    placeholder="e.g. MYAPP"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="dailySmsLimit"
                  label="Daily SMS Limit"
                  rules={[
                    { required: true, message: "Daily limit is required." },
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="e.g. 500"
                    size="large"
                    className="rounded-xl w-full"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="smsUrl"
                  label="SMS Gateway URL"
                  rules={[
                    {
                      required: true,
                      message: "SMS Gateway URL is required.",
                    },
                    {
                      type: "url",
                      message: "Enter a valid URL.",
                    },
                  ]}
                >
                  <Input
                    placeholder="e.g. https://api.smsprovider.com/send"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider className="my-5" />

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                danger
                size="large"
                icon={<LogoutOutlined />}
                className="h-11 rounded-xl px-6"
                onClick={logout}
                disabled={loading}
              >
                Logout
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                className="h-11 rounded-xl px-8"
              >
                {isUpdate ? "Update Settings" : "Save & Continue"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default AppSetupPage;
