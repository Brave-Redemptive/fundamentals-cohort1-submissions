import express from "express";
import { getAccount } from "./controllers/accountController.js";
import { transferMoney } from "./controllers/transferController.js";

const router = express.Router();

router.get("/accounts/:id", getAccount);
router.post("/transfer", transferMoney);

export default router;
