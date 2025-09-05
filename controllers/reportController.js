const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// Get inventory report
const getInventoryReport = async (req, res) => {
    try {
        const { lowStock } = req.query;
        let query = { businessId: req.user._id };

        if (lowStock === 'true') {
            query.stock = { $lt: 10 }; // Show products with stock less than 10
        }

        const products = await Product.find(query).sort({ stock: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transactions report
const getTransactionsReport = async (req, res) => {
    try {
        const { type, startDate, endDate, customerId, vendorId } = req.query;
        let query = { businessId: req.user._id };

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (customerId) {
            query.customerId = customerId;
        }

        if (vendorId) {
            query.vendorId = vendorId;
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

module.exports = { getInventoryReport, getTransactionsReport };