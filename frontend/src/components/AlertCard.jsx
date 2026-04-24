// src/components/AlertCard.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAlert } from "../app/uiSlice.js";

const riskConfig = {
  HIGH: {
    bg: "bg-red-50",
    badge: "text-red-400",
    dot: "bg-red-400",
  },
  MEDIUM: {
    bg: "bg-amber-50",
    badge: "text-amber-400",
    dot: "bg-amber-400",
  },
  LOW: {
    bg: "bg-blue-50",
    badge: "text-blue-400",
    dot: "bg-blue-400",
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
        cursor-pointer rounded-lg border p-3 transition-all bg-zinc-800
        ${isSelected ? "ring-2 ring-offset-1 ring-zinc-800" : "hover:brightness-95"}
      `}
    >
      {/* Top row — shipment ID + badge + time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-sm font-semibold text-zinc-300">
            {alert.shipmentId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium rounded-full ${cfg.badge}`}>
            {alert.riskLevel} 
          </span>
          <span className="text-xs text-zinc-600">
            {/* Call the pure function using the stable state */}
            {timeAgo(alert.createdAt, now)}
          </span>
        </div>
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
        {alert.reason}
      </p>

      {/* Disrupted edge */}
      {alert.disruptedEdge?.from && (
        <div className="mt-2 text-xs text-gray-300">
          Location:{" "}
          <span className="font-medium text-indigo-400">
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
              <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 border border-gray-700">
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
