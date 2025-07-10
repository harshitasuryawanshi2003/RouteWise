const axios = require("axios");
require("dotenv").config();

async function getDistanceBetweenCoords(from, to) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car`;

  try {
    const response = await axios.post(url, {
      coordinates: [
        [from.lng, from.lat],
        [to.lng, to.lat]
      ]
    }, {
      headers: {
        Authorization: process.env.ORS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const distance = response.data.routes?.[0]?.summary?.distance;

    if (distance === undefined) {
      console.error("Distance not found in ORS response. Full response:", JSON.stringify(response.data, null, 2));
      return null;
    }

    return distance; // in meters
  } catch (err) {
    console.error("Distance API Error:", err.message);
    return null;
  }
}

module.exports = getDistanceBetweenCoords;
