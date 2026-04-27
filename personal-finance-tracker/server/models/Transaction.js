const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
        },
        type: {
            type: String,
            required: [true, 'Please specify type (income/expense)'],
            enum: ['income', 'expense'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Please select a category'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date'],
            default: Date.now,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
