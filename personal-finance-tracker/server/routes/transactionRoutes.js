const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getTransactions).post(createTransaction);
router.route('/stats').get(getTransactionStats);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
