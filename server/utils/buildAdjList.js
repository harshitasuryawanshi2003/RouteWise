module.exports = function buildAdjList(edges) {
  const adjList = {};

  edges.forEach(edge => {
    if (!adjList[edge.from]) adjList[edge.from] = [];
    if (!adjList[edge.to]) adjList[edge.to] = [];

    adjList[edge.from].push({ node: edge.to, weight: edge.distance });
    adjList[edge.to].push({ node: edge.from, weight: edge.distance }); //undirected 
  });

  return adjList;
};
