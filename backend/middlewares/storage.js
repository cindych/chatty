const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './displayPics/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:|\./g, '') + file.originalname)
  },
})

const upload = multer({ storage })

module.exports = upload
