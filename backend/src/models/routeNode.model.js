import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    durationHrs: { type: Number, required: true },
    costScore: {
      type: Number,
      required: true,
      comment:
        "lower = cheaper. Used as edge weight in Dijkstra alongside duration.",
    },
    mode: {
      type: String,
      enum: ["air", "sea", "road", "rail"],
      deafult: "road",
    },
    status: { type: String, enum: ["active", "disrupted", "degraded"] },
    disruptionReason: { type: String, deafult: null },
    desruptedAt: { type: Date, default: null },
  },
  { _id: false },
);

const routeNodeSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["airport", "hub", "warehouse", "port"] },
    city: { type: String, required: true },
    state: { type: String },
    connections: { type: [connectionSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const RouteNode = mongoose.model("RouteNode", routeNodeSchema);
