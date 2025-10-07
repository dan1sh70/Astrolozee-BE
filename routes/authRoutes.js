import express from "express";
import { completeProfile, googleLogin, logIn, logOut, signUp } from "../controllers/authController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup",signUp);
router.post("/login",logIn);
router.post("/logout",logOut);
router.post('/google', googleLogin);
router.post('/complete-profile', protectRoute, completeProfile);

export default router;