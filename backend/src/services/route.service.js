import { RouteNode } from "../models/routeNode.model.js";
import { dijkstra } from "../engine/dijkstras.js";

// Build adjacency list from all RouteNode documents
async function buildGraph() {
  const nodes = await RouteNode.find({ isActive: true });
  const graph = {};

  for (const node of nodes) {
    graph[node.name] = node.connections.map((c) => ({
      to: c.to,
      durationHrs: c.durationHrs,
      status: c.status,
    }));
  }

  return graph;
}

export async function findOptimalPath(from, to) {
  const graph = await buildGraph();
  const result = dijkstra(graph, from, to);
  return result;
}

export async function markRouteDisrupted(
  from,
  to,
  reason = "disruption detected",
) {
  await RouteNode.updateOne(
    { name: from, "connections.to": to },
    {
      $set: {
        "connections.$.status": "disrupted",
        "connections.$.disruptionReason": reason,
        "connections.$.disruptedAt": new Date(),
      },
    },
  );
}

export async function markRouteActive(from, to) {
  await RouteNode.updateOne(
    { name: from, "connections.to": to },
    {
      $set: {
        "connections.$.status": "active",
        "connections.$.disruptionReason": null,
        "connections.$.disruptedAt": null,
      },
    },
  );
}
