import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { Card, Segmented, Spin } from "antd";

import { statsApiService } from "../service/StatsApiService";
import type { ReportType } from "../types/stats";

type SeriesBar = { name: string; data: number[] }[];

type ChartData =
  | { kind: "area"; categories: string[]; data: number[]; name: string; color?: string }
  | { kind: "bar"; categories: string[]; series: SeriesBar }
  | { kind: "donut" | "pie"; labels: string[]; series: number[] };

function groupSeries<T extends Record<string, string | number>>(
  rows: T[],
  xKey: keyof T,
  groupKey: keyof T,
  valueKey: keyof T,
): { categories: string[]; series: SeriesBar } {
  const categories = [...new Set(rows.map((r) => String(r[xKey])))];
  const groups = [...new Set(rows.map((r) => String(r[groupKey])))];
  return {
    categories,
    series: groups.map((g) => ({
      name: g,
      data: categories.map(
        (c) =>
          Number(
            rows.find(
              (r) => String(r[xKey]) === c && String(r[groupKey]) === g,
            )?.[valueKey] ?? 0,
          ),
      ),
    })),
  };
}

async function fetchChartData(report: ReportType): Promise<ChartData> {
  switch (report) {
    case "sms-by-day": {
      const data = await statsApiService.getDailyUsage();
      return {
        kind: "area",
        categories: data.map((d) => d.date),
        data: data.map((d) => d.total),
        name: "SMS Sent",
      };
    }
    case "monthly-usage": {
      const data = await statsApiService.getMonthlyUsage();
      return {
        kind: "area",
        categories: data.map((d) => d.month),
        data: data.map((d) => d.total),
        name: "SMS Sent",
      };
    }
    case "weekly-topics": {
      const rows = await statsApiService.getWeeklyTopicTrends();
      const { categories, series } = groupSeries(
        rows,
        "weekday",
        "category",
        "total",
      );
      return { kind: "bar", categories, series };
    }
    case "monthly-topic-trends": {
      const rows = await statsApiService.getMonthlyTopicTrends();
      const { categories, series } = groupSeries(
        rows,
        "month",
        "category",
        "total",
      );
      return { kind: "bar", categories, series };
    }
    case "most-frequent-topic": {
      const data = await statsApiService.getTopicFrequency();
      return {
        kind: "donut",
        labels: data.map((d) => d.category),
        series: data.map((d) => d.total),
      };
    }
    case "monthly-user-activity": {
      const rows = await statsApiService.getMonthlyUserActivity();
      const { categories, series } = groupSeries(
        rows,
        "month",
        "sent_by",
        "total",
      );
      return { kind: "bar", categories, series };
    }
    case "top-active-users": {
      const data = await statsApiService.getMostActiveUsers();
      return {
        kind: "bar",
        categories: data.map((d) => d.sent_by),
        series: [
          { name: "Campaigns", data: data.map((d) => d.campaigns) },
          { name: "Total SMS", data: data.map((d) => d.total_sms) },
        ],
      };
    }
    case "peak-usage-days": {
      const data = await statsApiService.getPeakUsageDays();
      return {
        kind: "bar",
        categories: data.map((d) => d.weekday),
        series: [{ name: "SMS Sent", data: data.map((d) => d.total) }],
      };
    }
    case "failure-trend": {
      const data = await statsApiService.getFailureTrend();
      return {
        kind: "area",
        categories: data.map((d) => d.date),
        data: data.map((d) => d.failed),
        name: "Failed SMS",
        color: "#ef4444",
      };
    }
    case "delivery-status": {
      const data = await statsApiService.getDeliveryOverview();
      return {
        kind: "pie",
        labels: ["Success", "Failed"],
        series: [data.successSms, data.failedSms],
      };
    }
  }
}

const REPORT_OPTIONS: { label: string; value: ReportType }[] = [
  { label: "SMS By Day", value: "sms-by-day" },
  { label: "Monthly Usage", value: "monthly-usage" },
  { label: "Weekly Topics", value: "weekly-topics" },
  { label: "Monthly Topics", value: "monthly-topic-trends" },
  { label: "Top Categories", value: "most-frequent-topic" },
  { label: "User Activity", value: "monthly-user-activity" },
  { label: "Top Users", value: "top-active-users" },
  { label: "Peak Usage Days", value: "peak-usage-days" },
  { label: "Failure Trend", value: "failure-trend" },
  { label: "Delivery", value: "delivery-status" },
];

const commonChartOptions = {
  chart: { toolbar: { show: false } },
  dataLabels: { enabled: false },
};

const ReportsComponent = () => {
  const [selectedReport, setSelectedReport] =
    useState<ReportType>("sms-by-day");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Partial<Record<ReportType, ChartData>>>({});

  useEffect(() => {
    const load = async () => {
      if (cache.current[selectedReport]) {
        setChartData(cache.current[selectedReport]!);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchChartData(selectedReport);
        cache.current[selectedReport] = data;
        setChartData(data);
      } catch (err) {
        console.error("Failed to load report", err);
        setError("Failed to load report data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedReport]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[400px]">
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-[400px] text-red-500 text-sm">
          {error}
        </div>
      );
    }

    if (!chartData) return null;

    if (chartData.kind === "area") {
      return (
        <Chart
          type="area"
          height={400}
          options={{
            ...commonChartOptions,
            xaxis: { categories: chartData.categories },
            stroke: { curve: "smooth" },
            colors: chartData.color ? [chartData.color] : undefined,
            fill: { type: "gradient" },
          }}
          series={[{ name: chartData.name, data: chartData.data }]}
        />
      );
    }

    if (chartData.kind === "bar") {
      return (
        <Chart
          type="bar"
          height={400}
          options={{
            ...commonChartOptions,
            xaxis: { categories: chartData.categories },
            plotOptions: { bar: { borderRadius: 4 } },
          }}
          series={chartData.series}
        />
      );
    }

    if (chartData.kind === "donut") {
      return (
        <Chart
          type="donut"
          height={400}
          options={{
            labels: chartData.labels,
            legend: { position: "bottom" },
          }}
          series={chartData.series}
        />
      );
    }

    if (chartData.kind === "pie") {
      return (
        <Chart
          type="pie"
          height={400}
          options={{
            labels: chartData.labels,
            legend: { position: "bottom" },
            colors: ["#22c55e", "#ef4444"],
          }}
          series={chartData.series}
        />
      );
    }

    return null;
  };

  return (
    <Card
      className="mt-8 rounded-2xl border-0 shadow-sm"
      styles={{ body: { padding: 24 } }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Reports & Analytics
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor messaging trends and delivery insights.
        </p>
      </div>

      <Segmented
        block
        size="large"
        value={selectedReport}
        onChange={(value) => setSelectedReport(value as ReportType)}
        options={REPORT_OPTIONS}
      />

      <div className="mt-8">{renderChart()}</div>
    </Card>
  );
};

export default ReportsComponent;
