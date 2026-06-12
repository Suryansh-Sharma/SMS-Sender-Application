import {
  CheckCircleOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Dropdown,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import AddUserModal from "../component/AddUserModal";
import { LoadingComponent } from "../component/LoadingComponent";
import { UserApiService } from "../service/UserApiService";
import { useAuth } from "../context/useAuth";
import { AuthApiService } from "../service/AuthApiService";
import type { ResetPasswordPayload, User } from "../types/auth";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AllUsersPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { user, logout } = useAuth();
  const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>();
  const navigate = useNavigate();
  const menuItems: MenuProps["items"] = [
    {
      key: "reset-password",
      label: "Reset Password",
    },
  ];
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await UserApiService.getAll();
      setUsers(res);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (target: User) => {
    const isCurrentUser = target.name === user?.name;

    Modal.confirm({
      title: isCurrentUser ? "Reset Your Password" : "Reset Password",
      content: (
        <div>
          <p>
            {isCurrentUser
              ? "Your password will be reset to default."
              : `Reset password for ${target.name}?`}
          </p>

          <div className="mt-3 rounded-lg bg-slate-100 p-3">
            <p className="text-sm text-slate-500">Default Password</p>

            <p className="font-semibold">Test@1234</p>
          </div>
        </div>
      ),
      okText: "Reset Password",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const payload: ResetPasswordPayload = { username: target.name };
          await AuthApiService.resetPassword(payload);
          message.success("Reset Password Successfully");
          if (isCurrentUser) {
            logout();
          }
        } catch (e: unknown) {
          if (e instanceof Error) {
            message.error(e.message);
          } else {
            message.error("Unable to reset password");
          }
        }
      },
    });
  };
  useEffect(() => {
    loadUsers();
  }, []);

  const columns = [
    {
      title: "User",
      key: "user",
      render: (record: User) => (
        <div className="flex items-center gap-3">
          <Avatar
            className={`${record.role === "ADMIN" ? "bg-indigo-600" : "bg-blue-500"} font-bold shadow-sm`}
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col">
            <Text strong className="text-slate-700 leading-none">
              {record.name}
            </Text>
            <Text type="secondary" className="text-[11px] mt-1">
              ID: #{record.id}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag
          className={`rounded-full border-none px-3 font-bold text-[10px] uppercase tracking-wider ${
            role === "ADMIN"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Joined On",
      dataIndex: "joined_on",
      key: "joined_on",
      render: (value: string) => new Date(value.replace(" ", "T") + "Z").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "isActive",
      render: (isActive: boolean) => (
        <div className="flex items-center gap-2">
          {isActive ? (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              className="rounded-md border-none px-2 font-medium"
            >
              Active
            </Tag>
          ) : (
            <Tag
              icon={<StopOutlined />}
              color="default"
              className="rounded-md border-none px-2 font-medium text-slate-400"
            >
              Inactive
            </Tag>
          )}
        </div>
      ),
    },

    {
      title: "",
      key: "actions",
      align: "right" as const,

      render: (_: unknown, record: User) => {
        const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
          switch (key) {
            case "reset-password":
              handleResetPassword(record);
              break;
          }
        };

        return (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: menuItems,
              onClick: handleMenuClick,
            }}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="text-slate-400"
            />
          </Dropdown>
        );
      },
    },
  ];

  if (loading) {
    return <LoadingComponent text="Loading Users data." />;
  }
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-1">
              <SafetyCertificateOutlined />
              <span className="uppercase tracking-widest text-[10px]">
                Administration
              </span>
            </div>
            <Title level={2} className="m-0! font-black tracking-tight">
              User Directory
            </Title>
          </div>

          <Space>
            <Button
              onClick={() => setOpenAddUserModal(true)}
              type="primary"
              icon={<UserAddOutlined />}
              className="h-11 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-200 border-none"
            >
              Add New User
            </Button>
            <Button
              onClick={() => navigate("/app-setting")}
              type="primary"
              icon={<SettingOutlined />}
              className="h-11 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-200 border-none"
            >
              Manage Application
            </Button>
          </Space>
        </div>

        {/* Content Table Card */}
        <div className="bg-white rounded-4xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Total: {users ? users.length : 0} Users
            </Text>
          </div>

          <Table
            dataSource={users}
            columns={columns}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10, className: "px-6" }}
            className="custom-user-table"
          />
          <AddUserModal
            open={openAddUserModal}
            onClose={() => setOpenAddUserModal(false)}
            onSuccess={loadUsers}
          />
        </div>
      </div>

      <style>{`
        .custom-user-table .ant-table-thead > tr > th {
          background: white !important;
          color: #94a3b8 !important;
          font-size: 11px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 16px 24px !important;
        }
        .custom-user-table .ant-table-tbody > tr > td {
          padding: 16px 24px !important;
          border-bottom: 1px solid #f8fafc !important;
        }
        .custom-user-table .ant-table-row:hover > td {
          background-color: #f8faff !important;
        }
      `}</style>
    </div>
  );
};

export default AllUsersPage;
