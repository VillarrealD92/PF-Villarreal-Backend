import { Router } from 'express';
import { createOrder, captureOrder, cancelPayment } from '../controllers/payment.controller.js';
import passport from "passport";
 

const router = Router();


router.get('/:cid/create-order', passport.authenticate("jwt", { session: false }), createOrder );

router.get('/capture-order', captureOrder);


router.get('/cancel-order', cancelPayment);

export default router;