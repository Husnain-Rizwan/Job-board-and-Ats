const cloudinary = require("../config/cloudinary");

const hasAllowedImageSignature = (buffer) => {
  if (!Buffer.isBuffer(buffer)) return false;
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
  const isWebp = buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  return isPng || isJpeg || isWebp;
};

const uploadCompanyLogo = (file, companyId) =>
  new Promise((resolve, reject) => {
    if (!file?.buffer || !hasAllowedImageSignature(file.buffer)) {
      return reject(new Error("Company logo must be a valid PNG, JPG, or WebP image"));
    }
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "job-board/company-logos",
        resource_type: "image",
        public_id: `${companyId || "company"}_${Date.now()}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 512, height: 512, crop: "limit" }],
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(file.buffer);
  });

module.exports = { uploadCompanyLogo };
