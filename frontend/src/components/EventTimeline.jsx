// src/components/EventTimeline.jsx
import { useSelector } from 'react-redux';
import { useGetShipmentTimelineQuery } from '../services/api.js';

const typeConfig = {
  DELAY:     { color: 'text-red-600',   bg: 'bg-red-100',    label: 'Delay'     },
  WEATHER:   { color: 'text-amber-600', bg: 'bg-amber-100',  label: 'Weather'   },
  BREAKDOWN: { color: 'text-red-700',   bg: 'bg-red-100',    label: 'Breakdown' },
  CUSTOMS:   { color: 'text-purple-600',bg: 'bg-purple-100', label: 'Customs'   },
  DEPARTED:  { color: 'text-blue-600',  bg: 'bg-blue-100',   label: 'Departed'  },
  ARRIVED:   { color: 'text-green-600', bg: 'bg-green-100',  label: 'Arrived'   },
};

export default function EventTimeline() {
  const shipmentId = useSelector(s => s.ui.selectedShipmentId);

  const { data, isLoading } = useGetShipmentTimelineQuery(shipmentId, {
    skip: !shipmentId,   // don't fetch if nothing selected
  });

  const events = data?.data || [];

  if (!shipmentId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        Select an alert to view shipment timeline
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">
          Shipment timeline
        </h2>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">
          {shipmentId}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading && (
          <div className="text-sm text-gray-400 text-center mt-8">
            Loading timeline...
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="text-sm text-gray-400 text-center mt-8">
            No events found for this shipment
          </div>
        )}

        {/* Timeline items */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200" />

          <div className="flex flex-col gap-4">
            {events.map((event) => {
              const cfg = typeConfig[event.type] || typeConfig.DEPARTED;
              return (
                <div key={event._id} className="flex gap-3 relative">
                  {/* Dot on the line */}
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    shrink-0 z-10 border-2 border-white ${cfg.bg}
                  `}>
                    <div className={`w-2 h-2 rounded-full ${cfg.color.replace('text', 'bg')}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {event.location}
                      {event.delayMinutes > 0 && (
                        <span className="text-red-500 ml-1">
                          +{event.delayMinutes} min
                        </span>
                      )}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <span className={`
                        text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}
                      `}>
                        Risk: {event.riskLevel}
                      </span>
                      {event.cause !== 'none' && (
                        <span className="text-xs text-gray-400 capitalize">
                          {event.cause}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}