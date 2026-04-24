import mongoose from "mongoose";
import "dotenv/config";
import { RouteNode } from "../src/models/routeNode.model.js";
import { ShipmentEvent } from "../src/models/shipmentEvent.model.js";
import { Alert } from "../src/models/alert.model.js";
import { scoreDisruption } from "../src/engine/disruption.engine.js";

await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected to MongoDB");

// ─── 1. ROUTE GRAPH ───────────────────────────────────────────────────────────

const routeNodes = [
  {
    name: "Mumbai",
    type: "port",
    city: "Mumbai",
    state: "Maharashtra",
    connections: [
      {
        to: "Pune",
        durationHrs: 4,
        costScore: 2,
        mode: "road",
        status: "active",
      },
      {
        to: "Ahmedabad",
        durationHrs: 7,
        costScore: 3,
        mode: "road",
        status: "active",
      },
      {
        to: "Delhi",
        durationHrs: 14,
        costScore: 5,
        mode: "rail",
        status: "disrupted",
        disruptionReason: "port strike",
        disruptedAt: new Date(),
      },
      {
        to: "Hyderabad",
        durationHrs: 9,
        costScore: 4,
        mode: "road",
        status: "active",
      },
    ],
  },
  {
    name: "Delhi",
    type: "hub",
    city: "New Delhi",
    state: "Delhi",
    connections: [
      {
        to: "Kolkata",
        durationHrs: 18,
        costScore: 6,
        mode: "rail",
        status: "active",
      },
      {
        to: "Ahmedabad",
        durationHrs: 10,
        costScore: 4,
        mode: "road",
        status: "active",
      },
      {
        to: "Hyderabad",
        durationHrs: 20,
        costScore: 7,
        mode: "road",
        status: "active",
      },
      {
        to: "Bangalore",
        durationHrs: 30,
        costScore: 9,
        mode: "air",
        status: "active",
      },
    ],
  },
  {
    name: "Pune",
    type: "warehouse",
    city: "Pune",
    state: "Maharashtra",
    connections: [
      {
        to: "Delhi",
        durationHrs: 10,
        costScore: 4,
        mode: "rail",
        status: "active",
      },
      {
        to: "Hyderabad",
        durationHrs: 6,
        costScore: 3,
        mode: "road",
        status: "active",
      },
      {
        to: "Bangalore",
        durationHrs: 8,
        costScore: 3,
        mode: "road",
        status: "active",
      },
    ],
  },
  {
    name: "Ahmedabad",
    type: "hub",
    city: "Ahmedabad",
    state: "Gujarat",
    connections: [
      {
        to: "Delhi",
        durationHrs: 9,
        costScore: 4,
        mode: "rail",
        status: "active",
      },
      {
        to: "Mumbai",
        durationHrs: 7,
        costScore: 3,
        mode: "road",
        status: "active",
      },
    ],
  },
  {
    name: "Chennai",
    type: "port",
    city: "Chennai",
    state: "Tamil Nadu",
    connections: [
      {
        to: "Bangalore",
        durationHrs: 4,
        costScore: 2,
        mode: "road",
        status: "active",
      },
      {
        to: "Hyderabad",
        durationHrs: 8,
        costScore: 3,
        mode: "road",
        status: "active",
      },
      {
        to: "Kolkata",
        durationHrs: 24,
        costScore: 8,
        mode: "rail",
        status: "active",
      },
    ],
  },
  {
    name: "Kolkata",
    type: "port",
    city: "Kolkata",
    state: "West Bengal",
    connections: [
      {
        to: "Delhi",
        durationHrs: 16,
        costScore: 6,
        mode: "rail",
        status: "active",
      },
      {
        to: "Hyderabad",
        durationHrs: 22,
        costScore: 8,
        mode: "rail",
        status: "active",
      },
    ],
  },
  {
    name: "Hyderabad",
    type: "hub",
    city: "Hyderabad",
    state: "Telangana",
    connections: [
      {
        to: "Bangalore",
        durationHrs: 5,
        costScore: 2,
        mode: "road",
        status: "active",
      },
      {
        to: "Chennai",
        durationHrs: 8,
        costScore: 3,
        mode: "road",
        status: "active",
      },
      {
        to: "Pune",
        durationHrs: 6,
        costScore: 3,
        mode: "road",
        status: "active",
      },
    ],
  },
  {
    name: "Bangalore",
    type: "airport",
    city: "Bangalore",
    state: "Karnataka",
    connections: [
      {
        to: "Chennai",
        durationHrs: 4,
        costScore: 2,
        mode: "road",
        status: "active",
      },
      {
        to: "Mumbai",
        durationHrs: 10,
        costScore: 4,
        mode: "air",
        status: "active",
      },
      {
        to: "Hyderabad",
        durationHrs: 5,
        costScore: 2,
        mode: "road",
        status: "active",
      },
      {
        to: "Delhi",
        durationHrs: 3,
        costScore: 6,
        mode: "air",
        status: "active",
      },
    ],
  },
];

// ─── 2. SHIPMENT EVENTS ───────────────────────────────────────────────────────

const rawEvents = [
  // HIGH risk — triggers immediate alert
  {
    shipmentId: "SHP-001",
    routeId: "MUM-DEL-001",
    type: "DELAY",
    location: "Mumbai",
    delayMinutes: 240,
    cause: "strike",
    priority: 3,
    dependentCount: 9,
  },
  {
    shipmentId: "SHP-002",
    routeId: "MUM-CHE-002",
    type: "WEATHER",
    location: "Pune",
    delayMinutes: 180,
    cause: "weather",
    priority: 3,
    dependentCount: 6,
  },
  {
    shipmentId: "SHP-003",
    routeId: "DEL-KOL-003",
    type: "BREAKDOWN",
    location: "Delhi",
    delayMinutes: 300,
    cause: "breakdown",
    priority: 2,
    dependentCount: 8,
  },

  // MEDIUM risk
  {
    shipmentId: "SHP-004",
    routeId: "AHM-DEL-004",
    type: "DELAY",
    location: "Ahmedabad",
    delayMinutes: 90,
    cause: "traffic",
    priority: 2,
    dependentCount: 3,
  },
  {
    shipmentId: "SHP-005",
    routeId: "HYD-CHE-005",
    type: "CUSTOMS",
    location: "Hyderabad",
    delayMinutes: 120,
    cause: "customs",
    priority: 2,
    dependentCount: 2,
  },
  {
    shipmentId: "SHP-006",
    routeId: "BLR-MUM-006",
    type: "DELAY",
    location: "Bangalore",
    delayMinutes: 60,
    cause: "traffic",
    priority: 3,
    dependentCount: 1,
  },
  {
    shipmentId: "SHP-007",
    routeId: "PUN-DEL-007",
    type: "WEATHER",
    location: "Pune",
    delayMinutes: 75,
    cause: "weather",
    priority: 2,
    dependentCount: 4,
  },
  {
    shipmentId: "SHP-008",
    routeId: "KOL-DEL-008",
    type: "DELAY",
    location: "Kolkata",
    delayMinutes: 100,
    cause: "congestion",
    priority: 1,
    dependentCount: 5,
  },

  // LOW risk / normal operations
  {
    shipmentId: "SHP-009",
    routeId: "MUM-PUN-009",
    type: "DEPARTED",
    location: "Mumbai",
    delayMinutes: 0,
    cause: "none",
    priority: 1,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-010",
    routeId: "MUM-PUN-009",
    type: "ARRIVED",
    location: "Pune",
    delayMinutes: 0,
    cause: "none",
    priority: 1,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-011",
    routeId: "DEL-BLR-011",
    type: "DEPARTED",
    location: "Delhi",
    delayMinutes: 0,
    cause: "none",
    priority: 2,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-012",
    routeId: "CHE-HYD-012",
    type: "DEPARTED",
    location: "Chennai",
    delayMinutes: 0,
    cause: "none",
    priority: 1,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-013",
    routeId: "AHM-MUM-013",
    type: "ARRIVED",
    location: "Mumbai",
    delayMinutes: 0,
    cause: "none",
    priority: 2,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-014",
    routeId: "HYD-BLR-014",
    type: "DELAY",
    location: "Hyderabad",
    delayMinutes: 20,
    cause: "traffic",
    priority: 1,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-015",
    routeId: "BLR-CHE-015",
    type: "ARRIVED",
    location: "Chennai",
    delayMinutes: 0,
    cause: "none",
    priority: 1,
    dependentCount: 0,
  },

  // Additional HIGH —
  {
    shipmentId: "SHP-016",
    routeId: "MUM-HYD-016",
    type: "BREAKDOWN",
    location: "Mumbai",
    delayMinutes: 360,
    cause: "breakdown",
    priority: 3,
    dependentCount: 11,
  },
  {
    shipmentId: "SHP-017",
    routeId: "KOL-HYD-017",
    type: "WEATHER",
    location: "Kolkata",
    delayMinutes: 200,
    cause: "weather",
    priority: 2,
    dependentCount: 7,
  },

  // Additional LOW
  {
    shipmentId: "SHP-018",
    routeId: "PUN-BLR-018",
    type: "DEPARTED",
    location: "Pune",
    delayMinutes: 0,
    cause: "none",
    priority: 1,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-019",
    routeId: "DEL-AHM-019",
    type: "ARRIVED",
    location: "Ahmedabad",
    delayMinutes: 0,
    cause: "none",
    priority: 2,
    dependentCount: 0,
  },
  {
    shipmentId: "SHP-020",
    routeId: "BLR-HYD-020",
    type: "DELAY",
    location: "Bangalore",
    delayMinutes: 30,
    cause: "traffic",
    priority: 1,
    dependentCount: 1,
  },
];

// Enrich every raw event with score + level
const enrichedEvents = rawEvents.map((e) => {
  const { score, level, reason } = scoreDisruption({
    type: e.type,
    delayMinutes: e.delayMinutes,
    priority: e.priority,
    dependentCount: e.dependentCount,
  });
  return {
    ...e,
    riskScore: score,
    riskLevel: level,
    alertCreated: level === "HIGH", // pre-flag so cron skips them
    destination: null,
  };
});

// ─── 3. PRE-BUILT ALERTS (for instant dashboard impact) ───────────────────────

const prebuiltAlerts = [
  {
    shipmentId: "SHP-001",
    routeId: "MUM-DEL-001",
    riskLevel: "HIGH",
    riskScore: 91,
    reason: "Score 91: DELAY event, 240min delay, priority 3, 9 dependents",
    disruptedEdge: { from: "Mumbai", to: "Delhi" },
    suggestedPath: ["Mumbai", "Pune", "Delhi"],
    suggestedPathHours: 24,
    originalPathHours: 14,
    status: "open",
  },
  {
    shipmentId: "SHP-002",
    routeId: "MUM-CHE-002",
    riskLevel: "HIGH",
    riskScore: 86,
    reason: "Score 86: WEATHER event, 180min delay, priority 3, 6 dependents",
    disruptedEdge: { from: "Pune", to: "Chennai" },
    suggestedPath: ["Mumbai", "Hyderabad", "Chennai"],
    suggestedPathHours: 17,
    originalPathHours: 13,
    status: "open",
  },
  {
    shipmentId: "SHP-003",
    routeId: "DEL-KOL-003",
    riskLevel: "HIGH",
    riskScore: 88,
    reason: "Score 88: BREAKDOWN event, 300min delay, priority 2, 8 dependents",
    disruptedEdge: { from: "Delhi", to: "Kolkata" },
    suggestedPath: ["Delhi", "Hyderabad", "Chennai", "Kolkata"],
    suggestedPathHours: 48,
    originalPathHours: 18,
    status: "open",
  },
  {
    shipmentId: "SHP-016",
    routeId: "MUM-HYD-016",
    riskLevel: "HIGH",
    riskScore: 95,
    reason:
      "Score 95: BREAKDOWN event, 360min delay, priority 3, 11 dependents",
    disruptedEdge: { from: "Mumbai", to: "Hyderabad" },
    suggestedPath: ["Mumbai", "Pune", "Hyderabad"],
    suggestedPathHours: 10,
    originalPathHours: 9,
    status: "acknowledged",
  },
  {
    shipmentId: "SHP-004",
    routeId: "AHM-DEL-004",
    riskLevel: "MEDIUM",
    riskScore: 52,
    reason: "Score 52: moderate disruption detected",
    disruptedEdge: { from: "Ahmedabad", to: "Delhi" },
    suggestedPath: [],
    suggestedPathHours: null,
    originalPathHours: null,
    status: "open",
  },
  {
    shipmentId: "SHP-017",
    routeId: "KOL-HYD-017",
    riskLevel: "HIGH",
    riskScore: 78,
    reason: "Score 78: WEATHER event, 200min delay, priority 2, 7 dependents",
    disruptedEdge: { from: "Kolkata", to: "Hyderabad" },
    suggestedPath: ["Kolkata", "Chennai", "Hyderabad"],
    suggestedPathHours: 32,
    originalPathHours: 22,
    status: "resolved",
    resolvedAt: new Date(Date.now() - 1000 * 60 * 40), // resolved 40min ago
  },
];

// ─── 4. WRITE TO DB ───────────────────────────────────────────────────────────

async function seed() {
  // Clear all collections
  await Promise.all([
    RouteNode.deleteMany({}),
    ShipmentEvent.deleteMany({}),
    Alert.deleteMany({}),
  ]);
  console.log("Collections cleared");

  // Insert route graph
  await RouteNode.insertMany(routeNodes);
  console.log(`Inserted ${routeNodes.length} route nodes`);

  // Insert enriched events
  await ShipmentEvent.insertMany(enrichedEvents);
  console.log(`Inserted ${enrichedEvents.length} shipment events`);

  // Insert pre-built alerts
  await Alert.insertMany(prebuiltAlerts);
  console.log(`Inserted ${prebuiltAlerts.length} alerts`);

  console.log("\nSeed complete. Summary:");
  console.log(`Route nodes : ${routeNodes.length}`);
  console.log(`Events      : ${enrichedEvents.length}`);
  console.log(
    `HIGH        : ${enrichedEvents.filter((e) => e.riskLevel === "HIGH").length}`,
  );
  console.log(
    `MEDIUM      : ${enrichedEvents.filter((e) => e.riskLevel === "MEDIUM").length}`,
  );
  console.log(
    `LOW         : ${enrichedEvents.filter((e) => e.riskLevel === "LOW").length}`,
  );
  console.log(`Alerts      : ${prebuiltAlerts.length}`);
  console.log(
    `open        : ${prebuiltAlerts.filter((a) => a.status === "open").length}`,
  );
  console.log(
    `acknowledged: ${prebuiltAlerts.filter((a) => a.status === "acknowledged").length}`,
  );
  console.log(
    `resolved    : ${prebuiltAlerts.filter((a) => a.status === "resolved").length}`,
  );
}

seed()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error("Seed failed:", err);
    mongoose.disconnect();
    process.exit(1);
  });
