const Bin = require("../models/Bin");
const Edge = require("../models/Edge");
const Report = require("../models/Report");
const getRoadDistance = require("../utils/getRoadDistance");
const generateNodeName = require("../utils/generateNodeName");
// const adjList = require("../utils/adjList"); // in-memory graph

// Add a new bin (including depot if type === 'depot')
exports.addBin = async (req, res) => {
  try {
    const { lat, lng, placename, type, fill, status } = req.body;

    // Ensure only one depot exists
    if (type === "depot") {
      const existingDepot = await Bin.findOne({ type: "depot" });
      if (existingDepot) {
        return res.status(400).json({ message: "Depot already exists" });
      }
    }

    // Generate next node name (e.g., Bin5)
    const node = await generateNodeName(type);

    const bin = await Bin.create({
      node,
      type,
      fill,
      status,
      location: {
        name: placename,
        coordinates: { lat, lng },
      },
    });

    // Auto-create edges between this bin and all other existing bins
    const existingBins = await Bin.find({ _id: { $ne: bin._id } });

    for (let other of existingBins) {
      const from = node;
      const to = other.node;

      const dist = await getRoadDistance(
        bin.location.coordinates,
        other.location.coordinates
      );

      console.log(dist);

      if(dist){
        // Avoid duplicate edge
        const existing = await Edge.findOne({ from, to });
        if (!existing) {
          await Edge.create({ from, to, distance: dist });
          await Edge.create({ from: to, to: from, distance: dist }); // bidirectional

          // update in-memory adjList
          // if (!adjList[from]) adjList[from] = [];
          // if (!adjList[to]) adjList[to] = [];

          // adjList[from].push({ node: to, distance: dist });
          // adjList[to].push({ node: from, distance: dist });
        }
      }
    }

    res.status(201).json({ success: true, bin });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//Get all bins
exports.getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find({});
    res.status(200).json({ success: true, data: bins });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bins", error: error.message });
  }
};

//Get bin by ID
exports.getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: "Bin not found" });

    res.status(200).json({ success: true, data: bin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bin", error: error.message });
  }
};

// Update a bin
exports.updateBin = async (req, res) => {
  try {
    const updated = await Bin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Bin not found" });

    res.status(200).json({ success: true, message: "Bin updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update bin", error: error.message });
  }
};

// Delete a bin
exports.deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: "Bin not found" });

    // delete all edges connected to this node
    await Edge.deleteMany({ $or: [{ from: bin.node }, { to: bin.node }] });

    //  delete all reports of that bin
    await Report.deleteMany({ binId: bin._id });

    res.status(200).json({ success: true, message: "Bin deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete bin", error: error.message });
  }
};
