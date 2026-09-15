const multer = require("multer");

const storage = multer.memoryStorage();

const resumeUpload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const isPDF = file.mimetype === "application/pdf" && file.originalname.toLowerCase().endsWith(".pdf");

    if (isPDF) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

const logoUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Company logos must be PNG, JPG, or WebP images"));
  },
});

module.exports = { resumeUpload, logoUpload };
