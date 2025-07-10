function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const priorityQueue = [];

  // Initialize distances
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startNode] = 0;

  priorityQueue.push({ node: startNode, distance: 0 });

  while (priorityQueue.length > 0) {
    // Get the node with smallest distance
    priorityQueue.sort((a, b) => a.distance - b.distance);
    const { node: current } = priorityQueue.shift();

    if (current === endNode) break;
    if (visited.has(current)) continue;

    visited.add(current);

    for (const neighbor of graph[current] || []) {
      const { node: neighborNode, weight } = neighbor;

      const newDist = distances[current] + weight;
      if (newDist < distances[neighborNode]) {
        distances[neighborNode] = newDist;
        previous[neighborNode] = current;
        priorityQueue.push({ node: neighborNode, distance: newDist });
      }
    }
  }

  // Build the path
  const path = [];
  let curr = endNode;
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return {
    path,
    distance: distances[endNode] === Infinity ? -1 : distances[endNode],
  };
}

module.exports = dijkstra;
