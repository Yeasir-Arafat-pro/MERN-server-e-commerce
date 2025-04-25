const multer = require('multer');
const { fileSize, fileType } = require('../secret');





const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './public/image/product')
  // },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix)
  }
})
  

  const fileFilter = (req, file, cb)=>{

    // if (!file.mimetype.startsWith("image/")) {
    //   return cb(new Error('Only images file are allowed', false))
    // }

    // if (file.size > fileSize) {
    //   return cb(new Error('file size exceed the maximum limit', false))
    // }

    if (!fileType.includes(file.mimetype)) {
      return cb(new Error('File type is not allowed', false))
    }

    cb(null, true)

  }

  const upload = multer({ 
    storage: storage,
   // fileFilter: fileFilter
   })

  module.exports = upload
  
//image to buufer string
/* const multer = require('multer');
const { fileSize, fileType } = require('../secret');


const storage = multer.memoryStorage()
  

  const fileFilter = (req, file, cb)=>{

    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error('Only images file are allowed', false))
    }

    if (file.size > fileSize) {
      return cb(new Error('file size exceed the maximum limit', false))
    }

    if (!fileType.includes(file.mimetype)) {
      return cb(new Error('File type is not allowed', false))
    }

    cb(null, true)

  }

  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
   })

  module.exports = upload
   */