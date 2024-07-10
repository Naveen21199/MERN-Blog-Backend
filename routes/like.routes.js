import { like, unlike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();
router.use(verifyJWT);

router.post("/posts/:id/like", like);
router.post("/posts/:id/unlike", unlike);

export default router;
