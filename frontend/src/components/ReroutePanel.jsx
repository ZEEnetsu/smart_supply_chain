// src/components/ReroutePanel.jsx
import { useSelector } from 'react-redux';
import { useGetAlertsQuery, useResolveAlertMutation } from '../services/api.js';

export default function ReroutePanel() {
  const selectedAlertId = useSelector(s => s.ui.selectedAlertId);
  const { data }        = useGetAlertsQuery('open');
  const [resolveAlert, { isLoading: resolving }] = useResolveAlertMutation();

  const alerts  = data?.data || [];
  const alert   = alerts.find(a => a._id === selectedAlertId);

  if (!alert) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        Select a HIGH alert to see reroute recommendation
      </div>
    );
  }

  if (alert.riskLevel !== 'HIGH' || !alert.suggestedPath?.length) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        No reroute available for this alert
      </div>
    );
  }

  const timeSaved = alert.originalPathHours && alert.suggestedPathHours
    ? alert.originalPathHours - alert.suggestedPathHours
    : null;

  const handleResolve = async () => {
    await resolveAlert(alert._id);
  };

  return (
    <div className="p-4 h-full flex flex-col gap-4">

      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-gray-800">
          Reroute recommendation
        </h2>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">
          {alert.shipmentId}
        </p>
      </div>

      {/* Disruption summary */}
      <div className="rounded-lg bg-red-50 border border-red-200 p-3">
        <p className="text-xs font-semibold text-red-700 mb-1">
          Disruption detected
        </p>
        <p className="text-xs text-red-600">
          {alert.reason}
        </p>
        {alert.disruptedEdge?.from && (
          <p className="text-xs text-red-500 mt-1">
            Blocked at: <span className="font-medium">{alert.disruptedEdge.from}</span>
          </p>
        )}
      </div>

      {/* Suggested path */}
      <div className="rounded-lg bg-green-50 border border-green-200 p-3">
        <p className="text-xs font-semibold text-green-700 mb-2">
          Suggested reroute
        </p>
        <div className="flex items-center gap-1 flex-wrap">
          {alert.suggestedPath.map((hub, i) => (
            <span key={hub} className="flex items-center gap-1">
              <span className="text-xs bg-white border border-green-200 px-2 py-1 rounded-md text-green-800 font-medium">
                {hub}
              </span>
              {i < alert.suggestedPath.length - 1 && (
                <span className="text-green-400 text-sm">→</span>
              )}
            </span>
          ))}
        </div>

        {/* Time comparison */}
        <div className="flex gap-4 mt-3">
          {alert.originalPathHours && (
            <div>
              <p className="text-xs text-gray-400">Original</p>
              <p className="text-sm font-semibold text-gray-700">
                {alert.originalPathHours} hrs
              </p>
            </div>
          )}
          {alert.suggestedPathHours && (
            <div>
              <p className="text-xs text-gray-400">Reroute</p>
              <p className="text-sm font-semibold text-green-700">
                {alert.suggestedPathHours} hrs
              </p>
            </div>
          )}
          {timeSaved !== null && (
            <div>
              <p className="text-xs text-gray-400">Delta</p>
              <p className={`text-sm font-semibold ${timeSaved >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {timeSaved >= 0 ? '-' : '+'}{Math.abs(timeSaved)} hrs
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resolve button */}
      <button
        onClick={handleResolve}
        disabled={resolving}
        className={`
          mt-auto w-full py-2.5 rounded-lg text-sm font-medium transition-colors
          ${resolving
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95'}
        `}
      >
        {resolving ? 'Resolving...' : 'Mark as resolved'}
      </button>

    </div>
  );
}