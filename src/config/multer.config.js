import multer from'multer'


const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './src/public/documents')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploader = multer({storage})