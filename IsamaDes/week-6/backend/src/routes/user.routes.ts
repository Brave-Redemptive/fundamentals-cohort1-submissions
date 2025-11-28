import express  from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { UserSchema } from "../validators/user.validator.js";
import { createUser, fetchUsers, getUserById, getCurrentUser} from "../controllers/admin.controller.js";
import { paginate } from "../middlewares/pagination.middleware.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create', validate(UserSchema), createUser);
router.get('/', paginate(20), fetchUsers)
router.get('/:userId', getUserById)
router.get('/me', protect, getCurrentUser)

export default router;