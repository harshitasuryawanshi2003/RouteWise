const express = require("express");
const router = express.Router();
const { getOptimizedRoute } = require("../controllers/RouteOptimizer");
const { auth, isCollector, isAdmin } = require("../middlewares/auth");

router.get("/optimized-route", auth, isCollector, getOptimizedRoute);

module.exports = router;
