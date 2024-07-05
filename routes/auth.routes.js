import { Router } from "express";
const router = Router();
import {
  checkLogin,
  sendOTP,
  userLogin,
  userRegister,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

//routes

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/sendotp", sendOTP);
router.get("/checklogin", verifyJWT, checkLogin);
export default router;
