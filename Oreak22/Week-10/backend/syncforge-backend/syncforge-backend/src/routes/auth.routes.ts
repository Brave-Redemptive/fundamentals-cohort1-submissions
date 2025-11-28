import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";
import { userSchema } from "../schemas/user.schema";

const router = Router();

router.post("/register", register);
router.post("/login", validate(userSchema), login);

export default router;
