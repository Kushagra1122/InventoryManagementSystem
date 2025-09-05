const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// Get all transactions for a business
const getTransactions = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        let query = { businessId: req.user._id };

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query)
            .populate('customerId', 'name')
            .populate('vendorId', 'name')
            .populate('products.productId', 'name')
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { type, customerId, vendorId, products, date } = req.body;

        // Calculate total amount
        let totalAmount = 0;
        for (const item of products) {
            totalAmount += item.quantity * item.price;
        }

        // Create transaction
        const transaction = await Transaction.create({
            type,
            customerId: type === 'sale' ? customerId : null,
            vendorId: type === 'purchase' ? vendorId : null,
            products,
            totalAmount,
            date: date || new Date(),
            businessId: req.user._id
        });

        // Update product stock
        for (const item of products) {
            const product = await Product.findOne({
                _id: item.productId,
                businessId: req.user._id
            });

            if (product) {
                if (type === 'purchase') {
                    product.stock += item.quantity;
                } else if (type === 'sale') {
                    if (product.stock < item.quantity) {
                        return res.status(400).json({
                            message: `Insufficient stock for ${product.name}`
                        });
                    }
                    product.stock -= item.quantity;
                }
                await product.save();
            }
        }

        const populatedTransaction = await Transaction.findById(transaction._id)
            .populate('customerId', 'name')
            .populate('vendorId', 'name')
            .populate('products.productId', 'name');

        res.status(201).json(populatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTransactions, createTransaction };