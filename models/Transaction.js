const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['sale', 'purchase'],
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    products: [transactionItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);