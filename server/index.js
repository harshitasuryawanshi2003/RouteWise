const express = require("express");
const cors = require("cors");
const { connect } = require("./config/database");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const binRoutes = require('./routes/binRoutes');
const reportRoutes = require("./routes/reportRoutes");
const optimizerRoutes = require('./routes/routeOptimizerRoutes');
const cookieParser = require("cookie-parser");


const app = express();
connect(); // Connect to MongoDB

app.use(cors({
  origin: 'http://localhost:3000', //frontend
  credentials: true // allow cookies
}));
app.use(express.json());
app.use(cookieParser()); 

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to RouteWise Backend!");
});

app.use("/api/auth", authRoutes);

app.use('/api/bins', binRoutes);

app.use("/api/reports", reportRoutes);

app.use('/api/route', optimizerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
