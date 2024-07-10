import express from "express";
const app = express();
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const server = createServer(app);
const io = new SocketIOServer(server);

//create blog
const createBlog = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, paragraph, category } = req.body;
  const blog = await Blog.create({
    title,
    description,
    imageUrl,
    paragraph,
    owner: req.user._id,
    category,
  });
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.blogs.push(blog._id);
  await user.save();
  return res
    .status(201)
    .json(new ApiResponse(201, blog, "Blog post created successfully"));
});
//get blog
const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog post retrieved successfully"));
});
//get all blog
const getblogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({});
  if (!blogs) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "All Blog post retrieved successfully"));
});
//update blog
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const { title, description, imageUrl, paragraph, category } = req.body;
  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401, "Unauthorized request");
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      imageUrl,
      paragraph,
      category,
    },
    { new: true }
  );
  if (!updatedBlog) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateBlog, "Blog post updated successfully"));
});
//delet blog
const deletBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.owner.toString() !== req.user.id.toString()) {
    throw new ApiError(404, "Unauthorized request");
  }
  const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  if (!deletedBlog) {
    throw new ApiError(404, "Blog post not found");
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.blogs.pull(req.params.id);
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, deletedBlog, "Blog post deleted successfully"));
});

// pagination
const getByKeyword = asyncHandler(async (req, res) => {
  const search = req.body.search || "";
  const page = parseInt(req.body.page) || 1;
  const perPage = 2;

  const searchQuery = new RegExp(search, "i");

  const totalBlogs = await Blog.find({ title: searchQuery }).count();
  const totalPages = Math.ceil(totalBlogs / perPage); // if (page < 1 || page > totalPages) {
  //   throw new ApiError(404, "Invalid page number");
  // }
  if (page < 1 || (totalBlogs > 0 && page > totalPages)) {
    throw new ApiError(404, "Invalid page number");
  }
  const skip = (page - 1) * perPage;
  const blogs = await Blog.find({ title: searchQuery })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        totalBlogs,
        currentPage: page,
      },
      "Blog posts retrieved successfully"
    )
  );
});

const checkLogin = asyncHandler(async (req, res) => {
  return res.json({
    ok: true,
    message: "User authenticated successfully",
  });
});

// ________________________________________Analytics and Metrics________________________________

// "/api/posts/:id/analytics"
const analytics = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Blog.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Retrieve analytics data (e.g., views, likes, comments count)
  const viewsCount = Blog.views.length;
  const likesCount = Blog.likes.length;
  const commentsCount = await Comment.countDocuments({ post: postId });

  res.json({
    viewsCount,
    likesCount,
    commentsCount,
  });
});

// TODO:   TODO:  TODO:   TODO: TODO:   TODO: TODO:   TODO: TODO:   TODO: TODO:   TODO: TODO:   TODO:

// _______________________Real-time updates with Socket.IO_______________________________

// Example: Real-Time Updates with Socket.io
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("User connected");

  // Example: Broadcast new post event
  socket.on("newPost", (postId) => {
    socket.broadcast.emit("newPost", postId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Usage in your API endpoints
// POST /api/posts
// app.post("/api/posts", authMiddleware, async (req, res) => {
const createRealTimePost = asyncHandler(async (req, res) => {
  // Create new post
  const newPost = await Blog.create({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
  });

  // Emit new post event
  io.emit("newPost", newBlog._id);

  res.status(201).json(newPost);
});

// ________________________________________Full-Text Search__________________________________

// Example: Full-Text Search Endpoint
// GET /api/posts/search
// app.get("/api/posts/search", async (req, res) => {
const fullTextSearch = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  const posts = await Blog.find({ $text: { $search: query } })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("author", "username")
    .populate("tags")
    .sort({ score: { $meta: "textScore" } });

  const totalPosts = await Blog.countDocuments({ $text: { $search: query } });

  res.json({
    posts,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalPosts / limit),
  });
});

// ____________________________Drafts and Publishing Workflow_________________________________

// Example: Drafts and Publish Endpoints
// GET /api/posts/drafts

// app.get("/api/posts/drafts", authMiddleware, async (req, res) => {
const draft = asyncHandler(async (req, res) => {
  const drafts = await Blog.find({ status: "draft", author: req.user._id })
    .populate("author", "username")
    .populate("tags")
    .sort({ createdAt: -1 });

  res.json(drafts);
});

// POST /api/posts/:id/publish
// app.post("/api/posts/:id/publish", authMiddleware, async (req, res) => {
const publish = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Blog.findByIdAndUpdate(
    postId,
    { status: "published" },
    { new: true }
  );

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
});

// ____________________________User Roles and Permissions_________________________________

// Example: Role-Based Access Control Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
};

// Example: Admin Endpoint
// GET /api/admin/users
app.get("/api/admin/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ____________________________File Uploads: _________________________________

// Example: File Upload Endpoint
// POST /api/uploads/avatar
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

// app.post("/api/uploads/avatar", upload.single("avatar"), async (req, res) => {
//   const userId = req.user._id;
//   try {
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { avatar: req.file.path },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// ____________________________Notifications _________________________________

// Example: Notifications Endpoint
// GET /api/notifications
// app.get("/api/notifications", authMiddleware, async (req, res) => {
const getNotification = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("sender", "username")
    .sort({ createdAt: -1 });

  res.json(notifications);
});

// ____________________________Custom Endpoint _________________________________

// Example: Custom Endpoint
// GET /api/reports/posts-per-month
// app.get("/api/reports/posts-per-month", async (req, res) => {
const postPerMonth = asyncHandler(async (req, res) => {
  const postsPerMonth = await Blog.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
  ]);

  res.json(postsPerMonth);
});

export {
  createBlog,
  getBlog,
  updateBlog,
  deletBlog,
  getByKeyword,
  checkLogin,
  getblogs,
};
