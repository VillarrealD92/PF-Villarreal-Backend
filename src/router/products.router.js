import { Router } from "express" 
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js"
import { checkAdminPermissions, checkPremiumPermissions } from "../middlewares/middlewares.js"
import passport from "passport"
import { uploader } from "../config/multer.config.js"


const router = Router()

router.get("/", getProducts)

router.get("/:pid", getProductById)

router.post("/", passport.authenticate("jwt", { session: false }),  uploader.single("file"), createProduct)

router.put("/:pid", passport.authenticate("jwt", { session: false }), checkAdminPermissions, updateProduct)

router.delete("/:pid", passport.authenticate("jwt", { session: false }), checkAdminPermissions, deleteProduct)

export default router
