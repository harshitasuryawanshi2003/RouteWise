const axios = require("axios");
const Bin = require("../models/Bin");
const Edge = require("../models/Edge");
const buildAdjList = require("../utils/buildAdjList");
const dijkstra = require("../utils/dijkstra");
require("dotenv").config();

const getRoutePolyline = async (start, end) => {
  const ORS_API_KEY = process.env.ORS_API_KEY;
  const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

  try {
    const response = await axios.post(
      url,
      { 
        coordinates:  [
          [start.lng, start.lat],
          [end.lng, end.lat]
      ]
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.features[0].geometry.coordinates; // [ [lng, lat], ... ]
  } catch (error) {
    console.error("ORS error:", error.response?.data || error.message);
    return []; // fallback: empty segment
  }
};

exports.getOptimizedRoute = async (req, res) => {
  try {
    // Step 1: Get the depot
    const depot = await Bin.findOne({ type: "depot" });
    if (!depot) {
      return res.status(400).json({ success: false, message: "Depot not found." });
    }

    // Step 2: Get all full bins (excluding depot)
    const fullBins = await Bin.find({ fill: { $gte: 75 }, status: "active", type: { $ne: "depot" } });
    if (fullBins.length === 0) {
      return res.status(200).json({ success: true, message: "No full bins to collect." });
    }

    // Step 3: Build graph
    const edges = await Edge.find({});
    const adjList = buildAdjList(edges);

    const visited = new Set();
    const finalPath = [];
    let currentNode = depot.node;
    let totalDistance = 0;
    let polylineCoords = [];

    while (visited.size < fullBins.length) {
      const remainingBins = fullBins.filter(bin => !visited.has(bin.node));
      let bestNext = null;
      let bestPath = [];
      let minDist = Infinity;

      for (let bin of remainingBins) {
        const { path, distance } = dijkstra(adjList, currentNode, bin.node);
        if (distance < minDist) {
          minDist = distance;
          bestNext = bin;
          bestPath = path;
        }
      }

      if (!bestNext || bestPath.length === 0) break;

      // Add intermediate bins and collect polyline for each segment
      for (let i = 1; i < bestPath.length; i++) {
        const fromNode = bestPath[i - 1];
        const toNode = bestPath[i];

        const fromBin = await Bin.findOne({ node: fromNode });
        const toBin = await Bin.findOne({ node: toNode });

        if (!fromBin || !toBin) continue;

        // Add to finalPath if not already added
        if (toNode !== depot.node && !finalPath.find(b => b.node === toNode)) {
          finalPath.push(toBin);
        }

        // Get polyline segment
        const fromCoord = fromBin.location.coordinates; 
        const toCoord = toBin.location.coordinates;
        const segment = await getRoutePolyline(fromCoord, toCoord);
        polylineCoords.push(...segment);
      }

      totalDistance += minDist;
      visited.add(bestNext.node);
      currentNode = bestNext.node;
    }

    return res.status(200).json({
      success: true,
      from: depot,
      route: finalPath,
      polyline: polylineCoords, // [ [lng, lat], [lng, lat], ... ]
      totalDistance: `${(totalDistance / 1000).toFixed(2)} km`
    });

  } catch (error) {
    console.error("Route error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
