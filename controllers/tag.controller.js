import { Tag } from "../models/tag.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// Create a Tag
// app.post("/api/tags", authMiddleware, async (req, res) => {
const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(404, "Pleaser enter the name ");
  }
  const tag = await Tag.create({ name });
  res.status(201).json(new ApiResponse(201, tag, "Tag created successfully"));
});

// Get All Tags
const getAllTag = asyncHandler(async (req, res) => {
  const tags = await Tag.find({});
  if (!tags) {
    throw new ApiError(404, "Tags not found");
  }

  res.json(new ApiResponse(200, tags, "All Tag fetched successfully"));
});

// Get a Single Tag by ID
const getTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  if (!tag) {
    throw new ApiError(404, "Tag not found ");
  }
  res.json(new ApiResponse(200, tag, "Tag fetched successfully"));
});

// Update a Tag
const updateTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const tag = await Tag.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!tag) {
    throw new ApiError(404, "Tag not found ");
  }
  res.json(new ApiResponse(200, tag, "Tag updated successfully"));
});

// Delete a Tag
const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);
  if (!tag) {
    return res.status(404).json({ error: "Tag not found" });
  }
  res.json(new ApiResponse(200, tag, "Tag deleted successfully"));
});

export { createTag, getAllTag, getTag, updateTag, deleteTag };
