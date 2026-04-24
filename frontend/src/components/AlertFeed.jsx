// src/components/AlertFeed.jsx
import { useState } from "react";
import { useGetAlertsQuery } from "../services/api.js";
import AlertCard from "./AlertCard.jsx";

const STATUS_TABS = ["open", "acknowledged", "resolved"];

export default function AlertFeed() {
  const [activeTab, setActiveTab] = useState("open");

  const { data, isLoading, isError } = useGetAlertsQuery(activeTab, {
    pollingInterval: 10000, // refetch every 10 seconds
  });

  const alerts = data?.data || [];

  // Sort: HIGH first, then MEDIUM, then LOW, then by time
  const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const sorted = [...alerts].sort((a, b) => {
    const riskDiff =
      (riskOrder[a.riskLevel] ?? 3) - (riskOrder[b.riskLevel] ?? 3);
    if (riskDiff !== 0) return riskDiff;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="flex flex-col h-full border bg-zinc-900">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-base font-semibold text-zinc-300">
          Disruption alerts
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Auto-refreshes every 10 seconds
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              text-xs px-3 py-1 rounded-full border transition-colors capitalize cursor-pointer
              ${
                activeTab === tab
                  ? "bg-blue-900 text-white border-gray-800"
                  : "bg-zinc-700 text-zinc-400 border-zinc-800 hover:border-gray-600"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
        {isLoading && (
          <div className="text-sm text-gray-400 text-center mt-8">
            Loading alerts...
          </div>
        )}

        {isError && (
          <div className="text-sm text-red-500 text-center mt-8">
            {console.log("Error fetching alerts:", isError)}
            Failed to load alerts. Is the backend running?
          </div>
        )}

        {!isLoading && !isError && alerts.length === 0 && (
          <div className="text-sm text-gray-400 text-center mt-8">
            No {activeTab} alerts
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2">
          {sorted.map((alert) => (
            <AlertCard key={alert._id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
