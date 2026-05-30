import { Spin } from "antd";

type Props = {
  fullScreen?: boolean;
  text?: string;
};

export const LoadingComponent = ({ fullScreen = false, text }: Props) => {
  return (
    <div
      style={{
        height: fullScreen ? "100vh" : "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Spin size="large" />

      {text && <span style={{ color: "#64748b" }}>{text}</span>}
    </div>
  );
};
