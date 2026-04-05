const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');


const getTransactions = asyncHandler(async (req, res) => {
    const { keyword, category, type, startDate, endDate, sort, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };


    if (keyword) {
        query.text = { $regex: keyword, $options: 'i' };
    }


    if (category) {
        query.category = category;
    }


    if (type) {
        query.type = type;
    }


    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }


    let sortOption = { date: -1, createdAt: -1 }; 
    if (sort) {
        const [field, order] = sort.split(':');
        sortOption = { [field]: order === 'desc' ? -1 : 1 };
    }


    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
        transactions,
        page: Number(page),
        pages: Math.ceil(total / limit),
        total,
    });
});


const getAnalytics = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);


    const categoryStats = await Transaction.aggregate([
        { $match: { user: userId, type: 'expense' } },
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 1,
                total: { $abs: '$total' },
                count: 1,
            }
        },
        { $sort: { total: 1 } },
    ]);


    const monthlyStats = await Transaction.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    type: '$type',
                },
                total: { $sum: '$amount' },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
        categoryStats,
        monthlyStats,
    });
});


const setTransaction = asyncHandler(async (req, res) => {
    if (!req.body.text || !req.body.amount || !req.body.type || !req.body.category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const transaction = await Transaction.create({
        text: req.body.text,
        amount: req.body.amount,
        type: req.body.type,
        category: req.body.category,
        date: req.body.date,
        user: req.user.id,
    });

    res.status(200).json(transaction);
});


const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(400);
        throw new Error('Transaction not found');
    }


    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }


    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.status(200).json(updatedTransaction);
});


const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(400);
        throw new Error('Transaction not found');
    }


    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }


    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getTransactions,
    getAnalytics,
    setTransaction,
    updateTransaction,
    deleteTransaction,
};
