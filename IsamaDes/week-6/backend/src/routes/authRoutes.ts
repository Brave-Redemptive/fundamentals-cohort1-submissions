import express from "express";
const router = express.Router();

import registerController from "../controllers/auth/registerController.js";
import loginController from "../controllers/auth/loginController.js";
import refreshTokenController from "../controllers/auth/refreshTokenController.js";
import logOutController  from "../controllers/auth/logOutController.js";


router.post("/register", registerController);

router.post("/login", loginController);

router.post("/refresh-token", refreshTokenController);

router.post("/logout", logOutController);

export default router;



