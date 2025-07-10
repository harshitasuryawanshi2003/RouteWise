
const express = require('express');
const router = express.Router();
const binController = require('../controllers/BinController');
const {auth, isAdmin} = require("../middlewares/auth");

// Protected by admin
// Add new bin
router.post('/add', auth, isAdmin, binController.addBin);
// Update a bin
router.put('/:id',auth, isAdmin, binController.updateBin);
// Delete a bin
router.delete('/:id',auth, isAdmin, binController.deleteBin);

// Authenticated users (Citizen/Collector/Admin) can read
// Get all bins
router.get('/', auth, binController.getAllBins);
// Get single bin by MongoDB ID 
router.get('/:id',auth, binController.getBinById);



module.exports = router;
