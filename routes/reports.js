const express = require('express');
const { getInventoryReport, getTransactionsReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/inventory', getInventoryReport);
router.get('/transactions', getTransactionsReport);

module.exports = router;