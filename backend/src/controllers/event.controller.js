import { asyncHandler } from "../utils/asyncHandler.js";
import { ingestEvent, getShipmentTimeline } from "../services/event.service.js";

export const ingest = asyncHandler(async (req, res) => {
  const event = await ingestEvent(req.body);
  res.status(201).json({ success: true, data: event });
});

export const timeline = asyncHandler(async (req, res) => {
  const events = await getShipmentTimeline(req.params.shipmentId);
  res.json({ success: true, count: events.length, data: events });
});
