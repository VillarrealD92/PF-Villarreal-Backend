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

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (username, password, done) => {

        if (username === amdinUserName && password === adminPassword) {
            const user = {
                _id: "admin",
                first_name: "admin",
                last_name: "admin",
                email: amdinUserName,
                age: "",
                password: adminPassword,
                role: "admin",
                cart: ""
            };
            const token = generateToken(user)
            user.token = token
            return done(null, user)
        }

        try {
            const user = await userService.getUserByEmail(username)
            if (!user) {
                console.log("No users registered with that email address");
                return done(null, false)
            }

            if (!validatePassword(password, user)) {
                console.log("Invalid Credentials");
                return done(null, false)
            }

            user.last_connection = new Date();
            await userService.updateUser(user.email, user);

            const token = generateToken(user)
            user.token = token

            done(null, user)

        } catch (error) {
            console.error("Error: " + error)
            return done("Error: " + error)
        }
    }))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([req => req?.cookies?.jwtCookie ?? null]),
        secretOrKey: jwtSign
    }, (payload, done) => {
        console.log({ jwtPayload: payload });
        done(null, payload)
    })
    )

    passport.use("github", new GitHubStrategy({
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: githubClientCallback,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            let user = await userService.getUserByEmail(profile._json.email)
            console.log(user);
            if (user) {
                console.log("User is logged in")
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
            console.error("Error: " + error)
            return done("Couldnt login with github")
        }
    }))

    passport.use("google", new GoogleStrategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleClientCallback,
        scope: ['email', 'profile']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            let user = await userService.getUserByEmail(profile._json.email)
            console.log(user);
            if (user) {
                console.log("User is logged in")
                const token = generateToken(user)
                user.token = token
                return done(null, user);
            }

            const newCart = await cartService.createNewCart()
            const newUser = {
                first_name: profile._json.name.givenName,
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
                console.log("User is already registered");
                return done(null, false)
            }

            const newCart = await cartService.createNewCart()
            console.log(newCart)
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