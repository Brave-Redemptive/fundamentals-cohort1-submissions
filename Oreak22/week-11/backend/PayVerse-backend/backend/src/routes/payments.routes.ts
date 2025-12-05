import { Router } from "express";
import { PaymentsController } from "../controllers/payments.controller";

const router = Router();

router.post("/", PaymentsController.create);
router.get("/", PaymentsController.getAll);
router.get("/:id", PaymentsController.getOne);

export default router;
