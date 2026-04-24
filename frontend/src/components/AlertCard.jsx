// src/components/AlertCard.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAlert } from "../app/uiSlice.js";

const riskConfig = {
  HIGH: {
    bg: "bg-red-50",
    border: "border-red-300",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  MEDIUM: {
    bg: "bg-amber-50",
    border: "border-amber-300",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  LOW: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
};

// Moved outside the component. Now a pure function.
const timeAgo = (dateStr, nowTimestamp) => {
  const diff = Math.floor((nowTimestamp - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

export default function AlertCard({ alert }) {
  const dispatch = useDispatch();
  const selectedAlertId = useSelector((s) => s.ui.selectedAlertId);
  const isSelected = selectedAlertId === alert._id;
  const cfg = riskConfig[alert.riskLevel] || riskConfig.LOW;

  // Lazily initialize `now` exactly once when this specific card mounts.
  // It will survive Redux-triggered re-renders without updating.
  const [now] = useState(() => Date.now());

  return (
    <div
      onClick={() => dispatch(selectAlert(alert))}
      className={`
        cursor-pointer rounded-lg border p-3 transition-all
        ${cfg.bg} ${cfg.border}
        ${isSelected ? "ring-2 ring-offset-1 ring-gray-400" : "hover:brightness-95"}
      `}
    >
      {/* Top row — shipment ID + badge + time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-sm font-semibold text-gray-800">
            {alert.shipmentId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}
          >
            {alert.riskLevel}
          </span>
          <span className="text-xs text-gray-400">
            {/* Call the pure function using the stable state */}
            {timeAgo(alert.createdAt, now)}
          </span>
        </div>
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
        {alert.reason}
      </p>

      {/* Disrupted edge */}
      {alert.disruptedEdge?.from && (
        <div className="mt-2 text-xs text-gray-500">
          Location:{" "}
          <span className="font-medium text-gray-700">
            {alert.disruptedEdge.from}
          </span>
        </div>
      )}

      {/* Suggested path pill — only for HIGH with a path */}
      {alert.riskLevel === "HIGH" && alert.suggestedPath?.length > 0 && (
        <div className="mt-2 flex items-center gap-1 flex-wrap">
          <span className="text-xs text-gray-400">Reroute:</span>
          {alert.suggestedPath.map((hub, i) => (
            <span key={hub} className="flex items-center gap-1">
              <span className="text-xs bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                {hub}
              </span>
              {i < alert.suggestedPath.length - 1 && (
                <span className="text-xs text-gray-300">→</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
