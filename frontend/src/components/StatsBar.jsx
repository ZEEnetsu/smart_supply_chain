// src/components/StatBar.jsx
import { useGetAlertsQuery } from '../services/api.js';

export default function StatBar() {
  const { data: openData }     = useGetAlertsQuery('open');
  const { data: resolvedData } = useGetAlertsQuery('resolved');

  const alerts   = openData?.data   || [];
  const resolved = resolvedData?.data || [];

  const highCount   = alerts.filter(a => a.riskLevel === 'HIGH').length;
  const mediumCount = alerts.filter(a => a.riskLevel === 'MEDIUM').length;
  const lowCount    = alerts.filter(a => a.riskLevel === 'LOW').length;

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-white border-b border-gray-200">

      <div className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
        <span className="text-xs text-red-600 font-medium uppercase tracking-wide">
          High risk
        </span>
        <span className="text-2xl font-semibold text-red-700">
          {highCount}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
        <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
          Medium risk
        </span>
        <span className="text-2xl font-semibold text-amber-700">
          {mediumCount}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          Low risk
        </span>
        <span className="text-2xl font-semibold text-blue-700">
          {lowCount}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-green-50 border border-green-200">
        <span className="text-xs text-green-600 font-medium uppercase tracking-wide">
          Resolved
        </span>
        <span className="text-2xl font-semibold text-green-700">
          {resolved.length}
        </span>
      </div>

    </div>
  );
}