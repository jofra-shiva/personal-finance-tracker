const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a category name'],
        },
        type: {
            type: String,
            required: [true, 'Please specify type (income/expense)'],
            enum: ['income', 'expense'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        color: {
            type: String,
            default: '#3b82f6',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Category', categorySchema);
