import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// Create a Category

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw ApiError(404, "Please enter the category");
  }
  const category = await Category.create({
    name,
  });
  res
    .status(201)
    .json(new ApiResponse(200, category, "Category created successfully"));
});

// Get All Categories
const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (!categories) {
    throw ApiError(404, "Categories not found");
  }
  res
    .status(201)
    .json(
      new ApiResponse(200, categories, "All Category fetched successfully")
    );
});

// Get a Single Category by ID
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw ApiError(404, "Category not found");
  }
  res
    .status(201)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

// Update a Category
const updatgeCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!category) {
    throw ApiError(404, "Category not found");
  }
  res
    .status(201)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

// Delete a Category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw ApiError(404, "Category not found");
  }
  res
    .status(201)
    .json(new ApiResponse(200, category, "Category deleted successfully"));
});

export {
  createCategory,
  getCategory,
  getAllCategory,
  updatgeCategory,
  deleteCategory,
};
