import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
// app.post("/api/posts/:id/comments", authMiddleware, async (req, res) => {
const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const post = await Blog.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const newComment = await Comment.create({
    content,
    author: req.user.id,
    post: req.params.id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, newComment, "Commented Successfully"));
});

// app.get("/api/posts/:id/comments", async (req, res) => {
const getComment = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ _id: req.params.id }).populate(
    "author",
    "username"
  );
  if (!comments) {
    throw new ApiError(404, "Comments not found");
  }
  res.status(200).json(new ApiResponse(200, comments, "Fetched Successfully"));
});

// app.delete(
//   "/api/posts/:postId/comments/:commentId",
//   authMiddleware,
//   async (req, res) => {
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (comment.author.toString() !== req.user.id) {
    throw new ApiError(404, "User not authorized");
  }

  // await comment.remove();
  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json(new ApiResponse(200, comment, "Comment removed"));
});

// ______________________________________search and pagination ____________________________________

// app.get("/api/posts/search", async (req, res) => {
//   const { q, page = 1, limit = 10 } = req.query;
//   try {
//     const query = q ? { title: { $regex: q, $options: "i" } } : {};
//     const posts = await Blog.find(query)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit))
//       .populate("author", "username");
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// ______________________________________Extra oridinary______________________________________
// Comments Endpoints
// POST /api/posts/:id/comments
// app.post("/api/posts/:id/comments", authMiddleware, async (req, res) => {
//   const postId = req.params.id;
//   const { content } = req.body;
//   try {
//     const post = await Blog.findById(postId);

//     if (!post) {
//       throw new ApiError(404, "Post not found");
//     }

//     // Create new comment
//     const comment = await Comment({
//       content,
//       post: postId,
//       author: req.user._id,
//     });

//     res.json(comment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// GET /api/posts/:id/comments
// app.get("/api/posts/:id/comments", async (req, res) => {
const postComment = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ post: postId })
    .populate("author", "username")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, comments, "Fetched post comments"));
});

// PUT /api/posts/:postId/comments/:commentId
// app.put(
//   "/api/posts/:postId/comments/:commentId",
//   authMiddleware,
//   async (req, res) => {

const updateComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, post: postId, author: req.user._id },
    { content },
    { new: true }
  );

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// DELETE /api/posts/:postId/comments/:commentId
// app.delete(
//   "/api/posts/:postId/comments/:commentId",
//   authMiddleware,
//   async (req, res) => {
//     const { postId, commentId } = req.params;
//     try {
//       const deletedComment = await Comment.findOneAndDelete({
//         _id: commentId,
//         post: postId,
//         author: req.user._id,
//       });

//       if (!deletedComment) {
//         throw new ApiError(404, "Comment not found");
//       }

//       res.json({ message: "Comment deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

export { createComment, getComment, updateComment, deleteComment, postComment };
