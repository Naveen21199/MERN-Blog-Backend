import {
  createComment,
  deleteComment,
  getComment,
  postComment,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();

// "/api/posts/:id/comments";
router.post("/create/posts/:id", verifyJWT, createComment);
router.get("/posts/:id", verifyJWT, postComment);
// router.get("/categories", verifyJWT, getAllCategory);
router.get("/:id", verifyJWT, getComment);
router.put("/posts/:postId/comments/:commentId", verifyJWT, updateComment);
router.delete("/posts/:postId/comments/:commentId", verifyJWT, deleteComment);
// router.get("/", verifyJWT, getByKeyword);

export default router;
