import UserDTO from "../DTO/user.dto.js";
import config from "../config/config.js";
import Mail from "../modules/mail.module.js";
import { userService } from "../repositories/index.repositories.js";
import { createHash, generateMailToken, verifyToken } from "../utils.js";


export const login = async(req, res) => {
    try {
        if (!req.user) return res.status(401).send("Invalid Credentials")
        req.session.user = req.user
        console.log(req.user);
        const { token } = req.user
        return res.cookie("jwtCookie", token).status(200).redirect("/products")
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal server error. Couldnt login.")
    }
}

export const github = (req,res) => {}

export const githubCallback = (req,res) => {   
    try {
        return res.cookie("jwtCookie", req?.user?.token).redirect("/products")
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal Server Error. GitHubCallback has failed")   
    }
}

export const google = (req,res) => {}

export const googleCallback = (req,res) => {   
    try {
        res.cookie('jwtCookie', req.user.token, { sameSite: 'none', secure: true });
        return res.redirect('/products');
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal Server Error. GoogleCallback has failed")   
    }
}

export const register = async(req, res) => { 
    try {
        return res.status(201).redirect("/")
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal server error. Couldnt process your register request.")
    }  
}

export const logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if(err) return res.send("Logout error")
            return res.redirect("/")
        })         
    } catch (error) {
        req.logger.error("Error: " + error)
        return res.status(500).send("Internal server error. Logout failure")
    }
}

export const current = (req, res) =>{
    try {
		const { user } = req.user
        const userDTO = new UserDTO(user)
		return res.json(userDTO);
	} catch (error) {
        req.logger.error("Error: " + error)
		return res.status(500).send("Internal Server Error. Couldnt get current user information.");
	}
}

export const mailPassword = async (req, res) =>{
    try {
        const mail = req.body.email
        const user = await userService.getUserByEmail(mail)

        if(!user) {
            return res.send("Invalid user")
        }

        const token = generateMailToken(user)
        const url = `http://localhost:${config.port}/resetPassword/${token}`
        
        const mailer = new Mail
        mailer.sendPasswordMail(mail, url)

        return res.send("An email has been sent to your account")
    } catch (error) {
        req.logger.error("Error: " + error)
		return res.status(500).send("Internal Server Error. Couldnt proceed with password reset process");
    }

}

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body
        
        const tokenData = verifyToken(token)

        const userMail = tokenData.user.email
        const hashedPassword = createHash(password)
        
        const changes = {password: hashedPassword}

        const updatePassword = await userService.updateUser(userMail, changes)
        console.log(updatePassword);

        return res.send("Your password has been updated")

    } catch (error) {
        req.logger.error("Error: " + error)
		return res.status(500).redirect("/restablishPassword"); 
    }
}