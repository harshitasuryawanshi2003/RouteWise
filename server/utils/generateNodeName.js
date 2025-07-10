const Bin = require("../models/Bin");

const generateNodeName = async (type) => {
  if (type === "depot") {
    return "Depot";
  }

  const bins = await Bin.find({ type: { $ne: "depot" } }).sort({ node: 1 });

  let i = 1;
  while (true) {
    const nodeName = `Bin${i}`;
    const exists = bins.find((b) => b.node === nodeName);
    if (!exists) return nodeName;
    i++;
  }
};

module.exports = generateNodeName;
