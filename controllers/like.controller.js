import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// Like a Post
// app.post("/api/posts/:id/like", authMiddleware, async (req, res) => {
const like = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Blog.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user has already liked the post
  if (post.likes.includes(req.user._id)) {
    return res.status(400).json({ error: "You have already liked this post" });
  }

  // Add user's ID to the likes array
  post.likes.push(req.user._id);
  await post.save();

  res.status(201).json(new ApiResponse(201, {}, "Post liked successfully"));
});

// Unlike a Post
// app.post("/api/posts/:id/unlike", authMiddleware, async (req, res) => {
const unlike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  // Assuming you have a Post model defined
  const post = await Blog.findById(postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Check if the user has already liked the post
  if (!post.likes.includes(req.user._id)) {
    return res.status(400).json({ error: "You have not liked this post" });
  }

  // Remove user's ID from the likes array
  post.likes = post.likes.filter(
    (userId) => userId.toString() !== req.user._id.toString()
  );
  await post.save();

  res.json({ message: "Post unliked successfully" });
});

export { like, unlike };
