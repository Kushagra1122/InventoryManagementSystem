const express = require('express');
const { body } = require('express-validator');
const { getTransactions, createTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const transactionValidation = [
    body('type').isIn(['sale', 'purchase']).withMessage('Type must be sale or purchase'),
    body('products').isArray({ min: 1 }).withMessage('At least one product is required'),
    body('products.*.productId').notEmpty().withMessage('Product ID is required'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('products.*.price').isNumeric().withMessage('Price must be a number')
];

// All routes are protected
router.use(protect);

// Routes
router.get('/', getTransactions);
router.post('/', transactionValidation, handleValidationErrors, createTransaction);

module.exports = router;