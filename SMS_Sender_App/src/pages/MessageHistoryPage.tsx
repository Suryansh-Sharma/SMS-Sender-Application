import { MessageOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { LoadingComponent } from "../component/LoadingComponent";
import { messageHistoryApi } from "../service/MessageApiService";
import { PaginationResponse } from "../types/common";
import { MessageHistory } from "../types/messageHistory";

const { Title, Text } = Typography;

const MessageHistoryPage = () => {
  const [isLoading, setLoading] = useState<boolean>(true);

  const [result, setResult] =
    useState<PaginationResponse<MessageHistory> | null>(null);

  const [page, setPage] = useState<number>(1);

  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    fetchData();
  }, [page, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await messageHistoryApi.getHistory(
        page,
        10,
        "sent_on",
        sortOrder,
      );

      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value: string) => (
        <Tag
          color="purple"
          style={{
            borderRadius: 999,
            paddingInline: 12,
            paddingBlock: 4,
          }}
        >
          {value}
        </Tag>
      ),
    },

    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (value: string) => <Text style={{ maxWidth: 350 }}>{value}</Text>,
    },

    {
      title: "Recipients",
      dataIndex: "total_recipients",
      key: "totalRecipients",
      sorter: true,
      render: (value: number) => <Text strong>{value}</Text>,
    },

    {
      title: "Failed",
      dataIndex: "failed_count",
      key: "failedCount",
      render: (value: number) => (
        <Tag color={value > 0 ? "red" : "green"} style={{ borderRadius: 999 }}>
          {value}
        </Tag>
      ),
    },

    {
      title: "Tokens",
      dataIndex: "total_token_used",
      key: "totalTokenUsed",
    },

    {
      title: "Sent By",
      dataIndex: "sent_by",
      key: "sentBy",
      render: (value: string) => <Text strong>{value}</Text>,
    },

    {
      title: "Sent On",
      dataIndex: "sent_on",
      key: "sentOn",
      render: (value: string) => new Date(value.replace(" ", "T") + "Z").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    },
  ];

  if (isLoading) {
    return <LoadingComponent text="Loading message history" />;
  }

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8fafc, #eef2ff)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>
          Message History
        </Title>

        <Text type="secondary">
          View all school SMS campaigns and delivery analytics
        </Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Campaigns"
              value={result?.pagination.total || 0}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>

        {/* <Col xs={24} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Recipients"
              value={totalRecipients}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Failed Messages"
              value={totalFailed}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col> */}
      </Row>

      {/* Table Section */}
      <Card
        bordered={false}
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <Space>
            <Select
              size="large"
              value={sortOrder}
              onChange={(value) => setSortOrder(value)}
              options={[
                {
                  label: "Newest First",
                  value: "DESC",
                },
                {
                  label: "Oldest First",
                  value: "ASC",
                },
              ]}
              style={{ width: 180 }}
            />
          </Space>
        </div>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={result?.data}
          pagination={{
            current: page,
            pageSize: 10,
            total: result?.pagination.total,
            showSizeChanger: false,
            onChange: (p) => setPage(p),
          }}
        />
      </Card>
    </div>
  );
};

export default MessageHistoryPage;
