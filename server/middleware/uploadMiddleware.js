const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const isPDF = file.originalname.toLowerCase().endsWith(".pdf");

    if (isPDF) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

module.exports = upload;