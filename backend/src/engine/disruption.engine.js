import { RISK_THRESHOLDS } from '../config/constants.js';

export function scoreDisruption({ type, delayMinutes = 0, priority = 2, dependentCount = 0 }) {

  // Factor 1: delay magnitude (0–40 points)
  const delayScore = Math.min((delayMinutes / 240) * 40, 40);

  // Factor 2: shipment priority (0–35 points)
  const priorityScore = (priority / 3) * 35;

  // Factor 3: cascade risk — how many downstream shipments affected (0–25 points)
  const cascadeScore = Math.min((dependentCount / 10) * 25, 25);

  // Type multiplier — some event types are inherently more severe
  const typeMultiplier = {
    DELAY:     1.0,
    WEATHER:   1.2,
    CUSTOMS:   0.9,
    BREAKDOWN: 1.3,
    DEPARTED:  0.1,
    ARRIVED:   0.0,
  }[type] ?? 1.0;

  const raw   = delayScore + priorityScore + cascadeScore;
  const score = Math.min(Math.round(raw * typeMultiplier), 100);

  let level, reason;

  if (score >= RISK_THRESHOLDS.HIGH) {
    level  = 'HIGH';
    reason = `Score ${score}: ${type} event, ${delayMinutes}min delay, priority ${priority}, ${dependentCount} dependents`;
  } else if (score >= RISK_THRESHOLDS.MEDIUM) {
    level  = 'MEDIUM';
    reason = `Score ${score}: moderate disruption detected`;
  } else {
    level  = 'LOW';
    reason = `Score ${score}: within acceptable parameters`;
  }

  return { score, level, reason };
}