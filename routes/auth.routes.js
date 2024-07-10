import { Router } from "express";
const router = Router();
import {
  checkLogin,
  getUser,
  login,
  logout,
  register,
  sendOTP,
  updateUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

//routes

router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);
router.post("/sendotp", sendOTP);
router.get("/checklogin", verifyJWT, checkLogin);

// TODO:
router.get("/get-user/:id", verifyJWT, getUser);
router.put("/update-user/:Id", verifyJWT, updateUser);
export default router;
