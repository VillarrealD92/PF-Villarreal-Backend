import { Router } from "express";
import { checkRegisteredUser, auth, checkAdminPermissions, checkUserPermissions, checkPremiumPermissions, checkAdminPremiumPermissions } from "../middlewares/middlewares.js"
import { cartView, productsView, realTimeProducts, chat, register, login, profile, restablishPassword, resetPasswordForm, usersCrud } from "../controllers/views.controller.js";
import passport from "passport";

const router = Router ()

router.get("/", checkRegisteredUser, login)
router.get("/register", register)
router.get("/profile", passport.authenticate("jwt", { session: false }), profile)

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), checkAdminPermissions, realTimeProducts)

router.get("/chat", passport.authenticate("jwt", { session: false }), checkAdminPremiumPermissions, chat)

router.get("/cart/:cid", passport.authenticate("jwt", { session: false }), cartView)

router.get("/products", passport.authenticate("jwt", { session: false }), productsView)

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), checkPremiumPermissions, realTimeProducts)

router.get("/usersrolecrud", passport.authenticate("jwt", { session: false }), checkAdminPermissions, usersCrud)

router.get("/restablishPassword", restablishPassword)

router.get("/resetPassword/:token", resetPasswordForm)

export default router
