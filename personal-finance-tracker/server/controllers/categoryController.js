const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all categories for user
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json(categories);
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
    const { name, type, color } = req.body;

    if (!name || !type) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const category = await Category.create({
        name,
        type,
        color,
        user: req.user.id,
    });

    res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // Check for user
    if (category.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // Check for user
    if (category.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await category.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
