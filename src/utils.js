import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from './config/config.js'
import { faker } from "@faker-js/faker"  

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export default __dirname

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const validatePassword = (password, user) => {
    return bcrypt.compareSync(password, user.password)
}



const PRIVATE_KEY = config.jwtSign

export const generateToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" })
}

export const generateMailToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" })
}

export const verifyToken = (token) =>{
    try {
        const tokenData = jwt.verify(token, PRIVATE_KEY)
        return tokenData
    } catch (error) {
        console.log(error);
        return null
    }

}

export const generateProduct = () => {
    return (
      {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.fromCharacters("abcdefghijklmnopqrstuvwxyz0123456789", 6),
        stock: faker.number.int({ max: 100 }),
        category: faker.commerce.category,
        status: faker.datatype.boolean()
      }
    )
  }