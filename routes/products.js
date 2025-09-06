const express = require('express');
const { body } = require('express-validator');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('category').notEmpty().withMessage('Category is required')
];

// All routes are protected
router.use(protect);

// Routes
router.get('/', getProducts);
router.post('/', productValidation, handleValidationErrors, createProduct);
router.put('/:id', handleValidationErrors, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;