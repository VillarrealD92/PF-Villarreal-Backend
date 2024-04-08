import passport from "passport"
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import GoogleStrategy from "passport-google-oauth20";
import passportJWT from "passport-jwt"
import { createHash, generateToken, validatePassword } from "../utils.js"
import config from "./config.js"
import { cartService, userService } from "../repositories/index.repositories.js"

const { jwtSign, githubClientId, githubClientSecret, githubClientCallback, amdinUserName, adminPassword, googleClientId, googleClientSecret, googleClientCallback } = config;

const LocalStrategy = local.Strategy
const JWTStrategy = passportJWT.Strategy

const initializePassport = () => {

    passport.use("login", new LocalStrategy ({
        usernameField: "email"
    }, async (username, password, done) => {

        try {
            const user = await userService.getUserByEmail(username)
            if (!user) {
                
                return done(null, false)
            }

            if(!validatePassword(password, user)){
                
                return done(null, false)
            }

            const token = generateToken(user)
            user.token = token

            done(null, user)
            
        } catch (error) {
            req.logger.error("Error: " + error) 
            return done("Error: " + error)
        }
    }))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([req => req?.cookies?.jwtCookie ?? null]),
        secretOrKey: config.jwtSign
      }, (payload, done) => {
        
        done(null, payload)
      })
    )

    passport.use("github", new GitHubStrategy({
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: githubClientCallback,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        
        try {
            let user = await userService.getUserByEmail(profile._json.email)
            
            if (user) {
                const token = generateToken(user)
                user.token = token
                return done(null, user);
            }

            const newCart = await cartService.createNewCart()
            const newUser = {
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                password: "",
                cart: newCart._id
            }

            user = await userService.createUser(newUser)

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch (error) {
            req.console.error("Error: " + error)
            return done("Couldnt login with github")
        }
    }))

    passport.use("google", new GoogleStrategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleClientCallback,
        scope: ['email', 'profile']
    }, async (accessToken, refreshToken, profile, done) => {
        
        try {
            let user = await userService.getUserByEmail(profile._json.email)
            
            if (user) {
                const token = generateToken(user)
                user.token = token
                return done(null, user);
            }

            const newCart = await cartService.createNewCart()
            const newUser = {
                first_name: profile._json.name.displayName,
                last_name: profile._json.name.familyName,
                email: profile._json.email,
                password: "",
                cart: newCart._id
            }

            user = await userService.createUser(newUser)

            const token = generateToken(user)
            user.token = token

            return done(null, user)
        } catch (error) {
            console.error("Error: " + error)
            return done("Couldnt login with google")
        }
    }));

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await userService.getUserByEmail(username)
            if (user) {
               
                return done(null, false)
            }

            const newCart = await cartService.createNewCart()
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart._id
            }

            const result = await userService.createUser(newUser)
            return done(null, result)
        } catch (error) {
            console.error("Error: " + error)
            return done("Error: " + error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {

        if (id === "admin") {
            return done(null, false);
        }

        const user = await userService.getUserById(id)
        done(null, user)
    })
}

export default initializePassport