import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/uploads")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  const fileFilter = (req, file, cb) => {
    // Check file type if needed
    // Example: allow only CSV files
    if (file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};
  
const upload = multer({ storage, fileFilter });

export { upload };