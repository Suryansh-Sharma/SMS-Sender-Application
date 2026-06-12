import {
  HistoryOutlined,
  SendOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionCard from "../component/ActionCard";
import CardComponent from "../component/CardComponent";
import { LoadingComponent } from "../component/LoadingComponent";
import { useAuth } from "../context/useAuth";
import { statsApiService } from "../service/StatsApiService";
import { SmsSpiApiService } from "../service/SmsApiService";
import type { DashboardStatsResponse } from "../types/stats";
import type { MessageHistory } from "../types/messageHistory";
import { Card, Table, Tag } from "antd";
import ReportsComponent from "../component/ReportsComponent";

export default function MainPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardStats, setDashboardStats] =
    useState<DashboardStatsResponse | null>(null);
  const [recentMessages, setRecentMessages] = useState<MessageHistory[]>([]);
  const [smsCredit, setSmsCredit] = useState<number | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [stats, messages, credit] = await Promise.allSettled([
          statsApiService.getDashboardApi(),
          statsApiService.getRecentMessages(),
          SmsSpiApiService.getCurrentSmsCredit(),
        ]);
        if (stats.status === "fulfilled") setDashboardStats(stats.value);
        if (messages.status === "fulfilled") setRecentMessages(messages.value);
        if (credit.status === "fulfilled") setSmsCredit(credit.value as number);
      } catch (err: unknown) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  if (loading || !dashboardStats) {
    return <LoadingComponent text="Please wait, Home page is loading" />;
  }
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
    },

    {
      title: "Message",
      dataIndex: "message",

      render: (text: string) =>
        text.length > 50 ? text.slice(0, 50) + "..." : text,
    },

    {
      title: "Recipients",
      dataIndex: "total_recipients",
    },

    {
      title: "Failed",
      dataIndex: "failed_count",
    },

    {
      title: "Status",
      dataIndex: "status",

      render: (status: string) => (
        <Tag color={status === "SENT" ? "green" : "red"}>{status}</Tag>
      ),
    },

    {
      title: "Date",
      dataIndex: "sent_on",
      render: (value: string) => new Date(value.replace(" ", "T") + "Z").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    },
  ];
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
      {/* Header section for context */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-slate-500 mt-1">
          Your communications and credit usage.
        </p>
      </header>

      {/* Stats Grid - 4 columns on large screens, 1 on mobile */}
      <div className="flex">
        <CardComponent
          title="Total Campaigns"
          subtitle={dashboardStats.totalCampaigns.toString()}
          icon="📢"
        />

        <CardComponent
          title="Total SMS Sent"
          subtitle={dashboardStats.totalSmsSent.toLocaleString()}
          icon="📨"
        />

        <CardComponent
          title="SMS Sent Today"
          subtitle={dashboardStats.smsSentToday.toLocaleString()}
          icon="📅"
        />

        <CardComponent
          title="SMS Credits"
          subtitle={smsCredit !== null ? smsCredit.toLocaleString() : "—"}
          icon="💳"
        />
      </div>
      <Card title="Recent Message Activity" className="mt-8 rounded-2xl">
        <Table
          columns={columns}
          dataSource={recentMessages}
          rowKey="id"
          pagination={false}
        />
      </Card>
      {/* Quick Actions Section */}
      <section className="mt-2">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold text-black">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            icon={<SendOutlined />}
            title="Send Message"
            onClick={() => navigate("send-msg")}
          />
          {user && user.role === "ADMIN" ? (
            <ActionCard
              icon={<UserAddOutlined />}
              title="All Users"
              onClick={() => navigate("all-users")}
            />
          ) : null}

          <ActionCard
            icon={<HistoryOutlined />}
            title="History"
            onClick={() => navigate("msg-history")}
          />
        </div>
      </section>

      {/* Statics Report Section. */}
      <section className="mt-5">
        <ReportsComponent />
      </section>
    </div>
  );
}
