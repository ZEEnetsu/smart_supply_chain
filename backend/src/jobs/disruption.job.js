import cron from 'node-cron';
import { ShipmentEvent } from '../models/shipmentEvent.model.js';
import { createAlert } from '../services/alert.service.js';
import { markRouteDisrupted } from '../services/route.service.js';
import { CRON_SCHEDULE } from '../config/constants.js';

async function checkForDisruptions() {
  try {
    // Find HIGH-risk events that haven't generated an alert yet
    const pendingEvents = await ShipmentEvent.find({
      riskLevel:    'HIGH',
      alertCreated: false,
    }).limit(10);

    if (pendingEvents.length === 0) return;

    console.log(`[CRON] Found ${pendingEvents.length} unprocessed HIGH-risk event(s)`);

    for (const event of pendingEvents) {
      try {
        // 1. Create the alert
        await createAlert({
          shipmentId:    event.shipmentId,
          routeId:       event.routeId,
          riskLevel:     event.riskLevel,
          riskScore:     event.riskScore,
          reason:        `Auto-detected: ${event.type} at ${event.location}. Delay: ${event.delayMinutes} min.`,
          disruptedEdge: { from: event.location, to: null },
        });

        // 2. Mark the route edge as disrupted in the graph
        if (event.cause !== 'none') {
          await markRouteDisrupted(
            event.location,
            null,
            `${event.cause} — auto-flagged by cron`
          );
        }

        // 3. Flip the flag so this event is never processed again
        await ShipmentEvent.findByIdAndUpdate(event._id, { alertCreated: true });

        console.log(`[CRON] Alert created for shipment ${event.shipmentId}`);
      } catch (innerErr) {
        // One failure should not stop processing the rest
        console.error(`[CRON] Failed to process event ${event._id}:`, innerErr.message);
      }
    }
  } catch (err) {
    console.error('[CRON] Job failed:', err.message);
  }
}

export function startDisruptionJob() {
  cron.schedule(CRON_SCHEDULE, checkForDisruptions);
  console.log(`[CRON] Disruption detection job started (${CRON_SCHEDULE})`);
}