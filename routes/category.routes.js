import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updatgeCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();

router.post("/create", verifyJWT, createCategory);
router.get("/categories", verifyJWT, getAllCategory);
router.get("/:id", verifyJWT, getCategory);
router.put("/:id", verifyJWT, updatgeCategory);
router.delete("/:id", verifyJWT, deleteCategory);
// router.get("/", verifyJWT, getByKeyword);

export default router;
