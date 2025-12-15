import { Router } from "express";
import { authRouter } from "./auth";
import { productRouter } from "./product";
import { cartRouter } from "./cart";

const router = Router();

router.use("/auth", authRouter);
router.use("/cart", cartRouter);
router.use("/products", productRouter);

export { router as v1Router };
