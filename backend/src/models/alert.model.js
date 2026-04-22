import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    shipmentId: { type: String, required: true, index: true },
    routeId: { type: String, required: true },
    riskLevel: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], index: true },
    riskScore: { type: Number, required: true },
    reason: { type: String, required: true },
    disruptedEdge: { from: { type: String }, to: { type: String } },
    suggestedPath: { type: [String], default: [] },
    suggestedPathHours: { type: Number, default: null },
    originalPathHours: { type: String, default: null },
    status: {
      type: String,
      enum: ["open", "acknowledged", "resolved"],
      default: "open",
      index: true,
    },
    resolvedAt: { type: Date, deafult: null },
  },
  { timestamps: true },
);

export const Alert = mongoose.model("Alert", alertSchema);