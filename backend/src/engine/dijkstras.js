export function dijkstra(graph, source, destination) {
  const dist  = {};
  const prev  = {};
  const visited = new Set();

  // Init all distances to Infinity
  for (const node of Object.keys(graph)) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[source] = 0;

  while (true) {
    // Pick unvisited node with smallest distance
    let current = null;
    for (const node of Object.keys(dist)) {
      if (!visited.has(node) && (current === null || dist[node] < dist[current])) {
        current = node;
      }
    }

    if (current === null || dist[current] === Infinity) break;
    if (current === destination) break;

    visited.add(current);

    for (const edge of (graph[current] || [])) {
      // Skip disrupted or degraded edges
      if (edge.status !== 'active') continue;

      const alt = dist[current] + edge.durationHrs;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = current;
      }
    }
  }

  // Reconstruct path
  if (dist[destination] === Infinity) {
    throw new Error(`No active route from ${source} to ${destination}`);
  }

  const path = [];
  let cur = destination;
  while (cur) {
    path.unshift(cur);
    cur = prev[cur];
  }

  return { path, totalHours: dist[destination] };
}