import express from "express"
import handlebars from "express-handlebars"
import session from "express-session"
import MongoStore from "connect-mongo"
import __dirname from "./utils.js"
import { Server } from "socket.io"
import viewsRouter from "./router/views.router.js"
import cartRouter from "./router/cart.router.js"
import productsRouter from "./router/products.router.js"
import sessionRouter from "./router/sessions.router.js"
import usersRouter from './router/users.router.js';
import loggerRouter from "./router/logger.router.js"
import paymentsRouter from "./router/payments.router.js"
import mongoose from "mongoose"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import config from "./config/config.js"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { chatService, productService } from "./repositories/index.repositories.js"
import { addLogger } from "./middlewares/logger.js"
import SwaggerUIexpress from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import Mail from "./modules/mail.module.js"
import morgan from "morgan"
import bodyParse from "body-parser"


const app = express()
app.use(bodyParse.urlencoded({ extended: true }))
app.use(bodyParse.json())
app.use(addLogger)
app.use(cookieParser())
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

app.use(morgan('dev'))

const { mongoUrl, mongoDB, port } = config

mongoose.connect(mongoUrl, {dbName: mongoDB})
    .then(() => {
        console.log("Mongo DB connected")
    })
    .catch(e => {
        console.log("Couldnt connect with Mongo DB, error message: "+e);
        res.status(500).send(e)
    })   


const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "MundoCan Documentation",
            description: "Complete documentation of MundoCan webpage"
        }
    },
    apis: [`${__dirname}/documentation/**/*.yaml`]
  }
const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocumentation", SwaggerUIexpress.serve, SwaggerUIexpress.setup(specs))

const sessionSecret=config.sessionSecret
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        dbName: mongoDB,
        ttl: 300
    }),    
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}))  

app.engine('handlebars', handlebars.engine())
app.use("/static", express.static(__dirname + "/public"))
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")


const httpServer = app.listen( port, () => console.log("Listening in "+ port ))
const socketServer = new Server(httpServer) 
socketServer.on("connection", async socket => {
    console.log("Client connected")
    
    try {
        const products = await productService.getAllProducts()
        socket.emit("products", products)
    } catch (error) {
        res.send(error)
    }
    
    socket.on("newProduct", async (data) =>{
        try {
            
            const {title, category, description, price, code, stock, owner} = data
            const newProduct = await productService.createProduct({title, category, description, price, code, stock, owner}) 
            const products = await productService.getAllProducts()
            socket.emit("products", products)
        } catch (error) {
            res.send(error)
        }
    })

    socket.on("deleteProduct", async productId => {
        try {
            await productService.deleteProduct(productId);

            const products = await productService.getAllProducts();
            socket.emit("products", products);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    });
    
    socket.on("message", async ({user, message}) => {
        try {
            await chatService.createMessage(user, message)
            const logs = await chatService.getMessages()
            socketServer.emit("logs", logs)
        } catch (error) {
            res.send(error)
        }
    })
})


initializePassport()
app.use(passport.initialize())
app.use(passport.session()) 


app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/session", sessionRouter);
app.use('/api/users', usersRouter);
app.use("/loggerTest", loggerRouter);
app.use("/api/payments", paymentsRouter);




