import express from "express";
const router = express.Router();

import {registerController, loginController, refreshTokenController, logoutUserController} from "../controllers/authController.js";



router.post("/register", registerController);

router.post("/login", loginController);

router.post("/refresh-token", refreshTokenController);

router.post("/logout", logoutUserController);

export default router;



