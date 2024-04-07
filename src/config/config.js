import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT || 8080,
    amdinUserName: process.env.ADMIN_USER,
    adminPassword: process.env.ADMIN_PASSWORD,
    mongoUrl: process.env.MONGO_URL,
    mongoDB: process.env.MONGO_DB,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubClientCallback: process.env.GITHUB_CLIENT_CALLBACK,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleClientCallback: process.env.GOOGLE_CLIENT_CALLBACK,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    jwtSign: process.env.JWT_SIGN,
    environment: process.env.ENVIRONMENT,
    mailService: process.env.MAIL_SERVICE,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    mailPort: process.env.MAIL_PORT,
    mercadoToken: process.env.MERCADO_TOKEN,
    mercadoKey: process.env.MERCADO_KEY,
    
    
    
    
   
}