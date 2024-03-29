import { Router } from "express";
import { checkRegisteredUser, auth, checkAdminPermissions, checkUserPermissions, checkPremiumPermissions } from "../middlewares/middlewares.js"
import { cartView, productsView, checkOutView, realTimeProducts, index, chat, register, login, profile, restablishPassword, resetPasswordForm } from "../controllers/views.controller.js";
import passport from "passport";

const router = Router ()

router.get("/", checkRegisteredUser, login)
router.get("/register", register)
router.get("/profile", passport.authenticate("jwt", { session: false }), profile)

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), checkAdminPermissions, realTimeProducts)

router.get("/chat", passport.authenticate("jwt", { session: false }), checkPremiumPermissions, chat)

router.get("/cart/:cid", passport.authenticate("jwt", { session: false }), cartView)

router.get("/products", passport.authenticate("jwt", { session: false }), productsView)
router.get("/index", index)

router.get("/checkout", passport.authenticate("jwt", { session: false }),checkOutView)

router.get("/restablishPassword", restablishPassword)
router.get("/resetPassword/:token", resetPasswordForm)

export default router
