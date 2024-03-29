import { Router } from "express"
import passport from "passport"
import { current, github, githubCallback, google, googleCallback, login, logout, mailPassword, register, resetPassword } from "../controllers/sessions.controller.js"

const router = Router() 

router.post("/login", passport.authenticate("login", {failureRedirect:"/"}) , login)

router.get("/github", passport.authenticate("github", { scope: ["user:email"] } ), github)

router.get("/google", passport.authenticate("google", { scope: ['profile','email'] } ), google)

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login", session: false}), githubCallback)

router.get("/googlecallback", passport.authenticate("google", {failureRedirect:"/login", session: false}), googleCallback)

router.post("/register", passport.authenticate("register", {failureRedirect:"/register"}), register)

router.get("/logout", logout)

router.get("/current", passport.authenticate("jwt", { session: false }), current)

router.post("/mailpassword", mailPassword)

router.post("/restablishpassword/", resetPassword)

export default router
