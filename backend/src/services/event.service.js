import { ShipmentEvent } from '../models/shipmentEvent.model.js';
import { scoreDisruption } from '../engine/disruption.engine.js';
import { createAlert } from './alert.service.js';

export async function ingestEvent(data) {
  const { type, delayMinutes, priority, dependentCount, shipmentId, routeId } = data;

  // Score it
  const { score, level, reason } = scoreDisruption({
    type, delayMinutes, priority, dependentCount,
  });

  // Persist the enriched event
  const event = await ShipmentEvent.create({
    ...data,
    riskScore:  score,
    riskLevel:  level,
    alertCreated: false,
  });

  // If high risk, immediately create an alert — don't wait for cron
  if (level === 'HIGH') {
    await createAlert({
      shipmentId,
      routeId,
      riskLevel: level,
      riskScore: score,
      reason,
      disruptedEdge: { from: data.location, to: data.destination ?? null },
    });

    // Mark so cron job skips it
    await ShipmentEvent.findByIdAndUpdate(event._id, { alertCreated: true });
  }

  return event;
}

export async function getShipmentTimeline(shipmentId) {
  return ShipmentEvent.find({ shipmentId })
    .sort({ createdAt: -1 })
    .limit(50);
}