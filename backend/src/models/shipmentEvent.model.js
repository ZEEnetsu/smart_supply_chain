import mongoose from "mongoose";

const shipmentEventSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["DELAY", "DEPARTED", "ARRIVED", "WEATHER", "CUSTOMS", "BREAKDOWN"],
      required: true,
    },
    location: { type: String, required: true },
    routeId: { type: String, required: true, index: true },
    delayMinutes: { type: Number, default: 0 },
    cause: {
      type: String,
      enum: [
        "weather",
        "traffic",
        "strike",
        "customs",
        "breakdown",
        "congestion",
        "none",
      ],
      default: "none",
    },
    priority: { type: Number, enum: [1, 2, 3], default: 2 },
    dependentCount: { type: Number, default: 0 },
    riskScore: { type: Number, min: 0, default: 0, max: 100 },
    riskLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },
    alertCreated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

shipmentEventSchema.index({ shipmentId: 1, createdAt: -1 });
shipmentEventSchema.index({ riskLevel: 1, alertCreated: 1 });

export const ShipmentEvent  = mongoose.model("ShipmentEvent", shipmentEventSchema);