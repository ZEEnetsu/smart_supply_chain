import { Alert } from '../models/alert.model.js';
import { findOptimalPath } from './route.service.js';

export async function createAlert({ shipmentId, routeId, riskLevel, riskScore, reason, disruptedEdge }) {

  // For HIGH alerts, auto-run the optimizer and embed the suggestion
  let suggestedPath       = [];
  let suggestedPathHours  = null;
  let originalPathHours   = null;

  if (riskLevel === 'HIGH' && disruptedEdge?.from && disruptedEdge?.to) {
    try {
      const result = await findOptimalPath(disruptedEdge.from, disruptedEdge.to);
      suggestedPath      = result.path;
      suggestedPathHours = result.totalHours;
    } catch (_) {
      // Optimizer failure should not block alert creation
    }
  }

  const alert = await Alert.create({
    shipmentId,
    routeId,
    riskLevel,
    riskScore,
    reason,
    disruptedEdge,
    suggestedPath,
    suggestedPathHours,
    originalPathHours,
    status: 'open',
  });

  return alert;
}

export async function getAlerts({ status = 'open', limit = 20 } = {}) {
  return Alert.find({ status })
    .sort({ riskLevel: -1, createdAt: -1 })
    .limit(Number(limit));
}

export async function resolveAlert(id) {
  const alert = await Alert.findByIdAndUpdate(
    id,
    { status: 'resolved', resolvedAt: new Date() },
    { new: true }
  );
  if (!alert) {
    const err = new Error('Alert not found');
    err.statusCode = 404;
    throw err;
  }
  return alert;
}