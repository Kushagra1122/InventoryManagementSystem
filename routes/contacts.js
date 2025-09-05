const express = require('express');
const { body } = require('express-validator');
const { getContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const contactValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('type').isIn(['customer', 'vendor']).withMessage('Type must be customer or vendor')
];

// All routes are protected
router.use(protect);

// Routes
router.get('/', getContacts);
router.post('/', contactValidation, handleValidationErrors, createContact);
router.put('/:id', contactValidation, handleValidationErrors, updateContact);
router.delete('/:id', deleteContact);

module.exports = router;