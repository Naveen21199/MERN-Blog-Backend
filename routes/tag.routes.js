import {
  createTag,
  deleteTag,
  getAllTag,
  getTag,
  updateTag,
} from "../controllers/tag.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();

router.post("/create", verifyJWT, createTag);
router.get("/tags", verifyJWT, getAllTag);
router.get("/:id", verifyJWT, getTag);
router.put("/:id", verifyJWT, updateTag);
router.delete("/:id", verifyJWT, deleteTag);
// router.get("/", verifyJWT, getByKeyword);

export default router;
