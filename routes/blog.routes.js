import {
  createBlog,
  deletBlog,
  getBlog,
  getByKeyword,
  updateBlog,
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();

router.post("/create", verifyJWT, createBlog);
router.get("/:id", verifyJWT, getBlog);
router.put("/:id", verifyJWT, updateBlog);
router.delete("/:id", verifyJWT, deletBlog);
router.get("/", verifyJWT, getByKeyword);

export default router;
