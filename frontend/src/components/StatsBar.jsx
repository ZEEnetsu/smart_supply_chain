// src/components/StatBar.jsx
import { useGetAlertsQuery } from "../services/api.js";
import StatCard from "./StatCard.jsx";

export default function StatBar() {
  const { data: openData } = useGetAlertsQuery("open");
  const { data: resolvedData } = useGetAlertsQuery("resolved");

  const alerts = openData?.data || [];
  const resolved = resolvedData?.data || [];

  const highCount = alerts.filter((a) => a.riskLevel === "HIGH").length;
  const mediumCount = alerts.filter((a) => a.riskLevel === "MEDIUM").length;
  const lowCount = alerts.filter((a) => a.riskLevel === "LOW").length;

  const statBarData = [
    {
      name: "High count",
      value: highCount,
      color: "text-red-400",
    },
    {
      name: "Medium count",
      value: mediumCount,
      color: "text-amber-400",
    },
    {
      name: "Low count",
      value: lowCount,
      color: "text-blue-400",
    },
    {
      name: "Resolved",
      value: resolved.length,
      color: "text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-zinc-900 border-b border-zinc-800">
      {statBarData.map((stat, idx) => {
        return (
          <StatCard
            statName={stat.name}
            color={stat.color}
            value={stat.value}
            key={idx}
          />
        );
      })}
    </div>
  );
}
