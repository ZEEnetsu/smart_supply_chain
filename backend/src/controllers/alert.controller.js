import { asyncHandler } from '../utils/asyncHandler.js';
import { getAlerts, resolveAlert } from '../services/alert.service.js';

export const list = asyncHandler(async (req, res) => {
  const { status, limit } = req.query;
  const alerts = await getAlerts({ status, limit });
  res.json({ success: true, count: alerts.length, data: alerts });
});

export const resolve = asyncHandler(async (req, res) => {
  const alert = await resolveAlert(req.params.id);
  res.json({ success: true, data: alert });
});