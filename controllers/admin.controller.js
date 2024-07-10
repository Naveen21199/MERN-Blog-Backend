// Get All Users (Admin)
app.get("/api/admin/users", adminAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-passwordHash"); // Exclude passwordHash from response
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a User (Admin)
app.delete("/api/admin/users/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optionally, delete associated posts or handle cascading deletion

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Posts (Admin View)
app.get("/api/admin/posts", adminAuthMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username"); // Populate author details
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Post (Admin)
app.delete("/api/admin/posts/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find and delete the post
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
