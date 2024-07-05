import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

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
export { createBlog, getBlog, updateBlog, deletBlog, getByKeyword, checkLogin };
