const Transaction = require('../models/Transaction');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, type, startDate, endDate } = req.query;

    const query = { user: req.user.id };

    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
        .populate('category')
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
        transactions,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalTransactions: count,
    });
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
    const { title, amount, type, category, date, description } = req.body;

    if (!title || !amount || !type || !category || !date) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const transaction = await Transaction.create({
        title,
        amount,
        type,
        category,
        date,
        description,
        user: req.user.id,
    });

    const populatedTransaction = await Transaction.findById(transaction._id).populate('category');

    res.status(201).json(populatedTransaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('category');

    res.status(200).json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Get transaction statistics for charts
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Monthly income vs expenses for bar chart
    const monthlyStats = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: {
                    month: { $month: "$date" },
                    year: { $year: "$date" },
                    type: "$type"
                },
                totalAmount: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Expense by category for pie chart
    const categoryStats = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), type: 'expense' } },
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        },
        { $unwind: '$categoryInfo' },
        {
            $group: {
                _id: '$categoryInfo.name',
                totalAmount: { $sum: '$amount' },
                color: { $first: '$categoryInfo.color' }
            }
        }
    ]);

    // Total balance, income, expenses
    const summaryStats = await Transaction.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ]);

    res.status(200).json({
        monthlyStats,
        categoryStats,
        summaryStats
    });
});

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
};
