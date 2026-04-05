const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    text: {
        type: String,
        required: [true, 'Please add a text description'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number'],
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Food', 'Rent', 'Travel', 'Utilities', 'Entertainment', 'Health', 'Income', 'Other'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', transactionSchema);
