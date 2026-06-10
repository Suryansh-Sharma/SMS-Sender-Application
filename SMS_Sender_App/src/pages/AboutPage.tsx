import {
  CodeOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  GithubOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Card, Divider, Tag, Timeline } from "antd";

const TECH_STACK = [
  { name: "Electron", desc: "Cross-platform desktop shell" },
  { name: "React 19", desc: "UI component library" },
  { name: "TypeScript", desc: "Typed JavaScript" },
  { name: "Tailwind CSS v4", desc: "Utility-first styling" },
  { name: "Ant Design v6", desc: "Enterprise UI components" },
  { name: "Vite 8", desc: "Lightning-fast build tool" },
  { name: "better-sqlite3", desc: "Local embedded database" },
  { name: "Spring Edge API", desc: "SMS gateway provider" },
  { name: "ApexCharts", desc: "Interactive data charts" },
  { name: "Axios", desc: "HTTP client for API calls" },
  { name: "xlsx", desc: "Excel file parsing" },
  { name: "React Router v7", desc: "Client-side routing" },
];

const FEATURES = [
  {
    icon: <SendOutlined />,
    title: "Bulk SMS Campaigns",
    desc: "Send personalised SMS messages to hundreds of recipients in a single campaign using Excel/CSV upload.",
  },
  {
    icon: <MessageOutlined />,
    title: "SMS Templates",
    desc: "Pre-built message templates for common school communication scenarios — fees, events, results, and more.",
  },
  {
    icon: <DatabaseOutlined />,
    title: "Message History",
    desc: "Full audit trail of every campaign with per-recipient delivery status, timestamps, and failure counts.",
  },
  {
    icon: <TeamOutlined />,
    title: "Multi-user Access",
    desc: "Role-based access control with ADMIN and USER roles. Admins manage users, settings, and all campaigns.",
  },
  {
    icon: <DesktopOutlined />,
    title: "Offline-first Database",
    desc: "SQLite embedded database stores all data locally — no internet required for history and reports.",
  },
  {
    icon: <InfoCircleOutlined />,
    title: "Live Dashboard & Reports",
    desc: "Real-time stats on credits, campaigns, and daily SMS volume with interactive ApexCharts graphs.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Secure Authentication",
    desc: "Login-protected with hashed passwords, forced password change on first login, and session management.",
  },
  {
    icon: <SettingOutlined />,
    title: "App Configuration",
    desc: "Admin-controlled Spring Edge API credentials and sender ID — no code changes needed.",
  },
];

const HOW_TO_USE = [
  {
    color: "#7c3aed",
    children: (
      <span style={{ color: "#334155", fontSize: 14 }}>
        <b>Login</b> — Enter your credentials. On first login you will be asked
        to set a new password.
      </span>
    ),
  },
  {
    color: "#7c3aed",
    children: (
      <span style={{ color: "#334155", fontSize: 14 }}>
        <b>Configure API (Admin)</b> — Go to <i>App Setting</i> and enter your
        Spring Edge API key and sender ID.
      </span>
    ),
  },
  {
    color: "#7c3aed",
    children: (
      <span style={{ color: "#334155", fontSize: 14 }}>
        <b>Prepare your recipient list</b> — Create an Excel file with a column
        named{" "}
        <code
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            background: "#f1f5f9",
            padding: "2px 6px",
            borderRadius: 4,
            color: "black",
          }}
        >
          mobile
        </code>{" "}
        containing 10-digit phone numbers.
      </span>
    ),
  },
  {
    color: "#7c3aed",
    children: (
      <span style={{ color: "#334155", fontSize: 14 }}>
        <b>Send SMS</b> — Click <i>Send SMS</i> in the navbar, pick a template
        or write a custom message, upload your Excel file, preview, and send.
      </span>
    ),
  },
  {
    color: "#7c3aed",
    children: (
      <span style={{ color: "#334155", fontSize: 14 }}>
        <b>Track delivery</b> — Visit <i>Message History</i> to see per-campaign
        delivery status and failure details.
      </span>
    ),
  },
  {
    color: "#7c3aed",
    children: (
      <span style={{ color: "#334155", fontSize: 14 }}>
        <b>Monitor credits</b> — Your remaining SMS credits are shown on the
        Dashboard, fetched live from Spring Edge.
      </span>
    ),
  },
];

const APP_INFO = [
  { label: "Application Name", value: "SMS Sender Pulse" },
  { label: "Version", value: "1.0.0" },
  { label: "App ID", value: "com.smssenderpro.app" },
  { label: "Platform", value: "Electron (Windows / Linux)" },
  { label: "SMS Provider", value: "Spring Edge API" },
  { label: "Database", value: "SQLite (better-sqlite3)" },
  { label: "Build Tool", value: "Vite 8 + electron-builder" },
  { label: "License", value: "Private / Proprietary" },
  { label: "Copyright", value: "© 2026 SMS Sender Pro" },
];

function SectionHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6" style={{ textAlign: "left" }}>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: "#64748b" }}>{sub}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "2.5rem",
        textAlign: "left",
      }}
    >
      {/* Hero */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 24,
            background: "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)",
            boxShadow: "0 20px 50px rgba(124,58,237,0.3)",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>
            S
          </span>
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.5px",
            marginBottom: 8,
          }}
        >
          SMS Sender Pulse
        </div>

        <div
          style={{
            fontSize: 16,
            color: "#64748b",
            maxWidth: 480,
            margin: "0 auto 16px",
            lineHeight: 1.6,
          }}
        >
          A desktop application for school bulk SMS management — built for
          speed, simplicity, and reliability.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Badge count="v1.0.0" style={{ backgroundColor: "#7c3aed" }} />
          <Tag color="green">Stable</Tag>
          <Tag color="blue">Desktop App</Tag>
          <Tag color="purple">School Communication</Tag>
        </div>
      </section>

      <Divider />

      {/* Features */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeading
          title="Features"
          sub="Everything you need to communicate at scale."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              hoverable
              style={{ borderRadius: 16 }}
              styles={{ body: { padding: 20 } }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#ede9fe,#f5d0fe)",
                  color: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>
                {f.desc}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      {/* How to Use */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeading
          title="How to Use"
          sub="Get started in under five minutes."
        />
        <Card
          style={{ borderRadius: 16, maxWidth: 600 }}
          styles={{ body: { padding: 24 } }}
        >
          <Timeline items={HOW_TO_USE} />
        </Card>
      </section>

      <Divider />

      {/* Tech Stack */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeading
          title="Tech Stack"
          sub="Built with modern, production-grade technologies."
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {TECH_STACK.map((t) => (
            <Card
              key={t.name}
              hoverable
              size="small"
              style={{ borderRadius: 12, minWidth: 160 }}
              styles={{ body: { padding: "10px 14px" } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CodeOutlined style={{ color: "#7c3aed", fontSize: 16 }} />
                <div>
                  <div
                    style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      {/* Developer */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeading
          title="Developer"
          sub="The person behind the product."
        />
        <Card
          hoverable
          style={{ borderRadius: 16, maxWidth: 420 }}
          styles={{ body: { padding: 24 } }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg,#7c3aed,#c084fc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              S
            </div>
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: 2,
                }}
              >
                Suryansh Sharma
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>
                Software Engineer
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <a
                  href="mailto:suryanshsharma1942@gmail.com"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#7c3aed",
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  <MailOutlined />
                  suryanshsharma1942gmail@.com
                </a>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  <UserOutlined />
                  Self Developer
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Divider />

      {/* App Info */}
      <section style={{ marginBottom: "3rem" }}>
        <SectionHeading
          title="Application Info"
          sub="Technical details about this build."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
            maxWidth: 760,
          }}
        >
          {APP_INFO.map((item) => (
            <Card
              key={item.label}
              size="small"
              style={{ borderRadius: 12 }}
              styles={{ body: { padding: "12px 16px" } }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>
                {item.value}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          color: "#94a3b8",
          fontSize: 13,
          paddingBottom: 16,
        }}
      >
        <a
          href="https://github.com/Suryansh-Sharma/SMS-Sender-Application"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubOutlined style={{ marginRight: 6 }} />
          GitHub
        </a>
        SMS Sender Pulse — Built with React, Electron &amp; Tailwind CSS
        &nbsp;·&nbsp; © 2026 Suryansh Sharma
      </div>
    </div>
  );
}
