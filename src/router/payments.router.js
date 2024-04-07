import { Router } from 'express';
import { createOrderMP, getPublicKey } from "../controllers/payments.controller.js";

const router = Router();

router.post("/createorder/:totalAmount", createOrderMP)
router.get("/publicKey", getPublicKey)


export default router