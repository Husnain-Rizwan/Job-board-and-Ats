const cloudinary = require("../config/cloudinary");

const RESUME_FOLDERS = {
  application: "job-board/resumes",
  profile: "job-board/profile-resumes",
};

const isPdfBuffer = (buffer) =>
  Buffer.isBuffer(buffer) && buffer.subarray(0, 5).toString() === "%PDF-";

const uploadResumePdf = (file, folder, userId) =>
  new Promise((resolve, reject) => {
    if (!file?.buffer || !isPdfBuffer(file.buffer)) {
      reject(new Error("A valid PDF resume is required"));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        // Cloudinary handles standard PDFs as image assets, allowing normal
        // browser PDF viewing and optional page/thumbnail transformations.
        resource_type: "image",
        type: "authenticated",
        public_id: `${userId}_${Date.now()}`,
        format: "pdf",
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );

    uploadStream.end(file.buffer);
  });

const uploadApplicationResume = (file, userId) =>
  uploadResumePdf(file, RESUME_FOLDERS.application, userId);

const uploadProfileResume = (file, userId) =>
  uploadResumePdf(file, RESUME_FOLDERS.profile, userId);

// Some records may have been uploaded as raw assets before PDFs were handled
// as image assets. Keep those existing resumes viewable and removable.
const resourceTypeForResume = (resume) =>
  resume?.url?.includes("/raw/") ? "raw" : "image";

const deleteResumePdf = (resume) =>
  cloudinary.uploader.destroy(resume.publicId, {
    resource_type: resourceTypeForResume(resume),
    type: "authenticated",
    invalidate: true,
  });

const getSignedResumeUrl = (resume) => {
  const resourceType = resourceTypeForResume(resume);

  return cloudinary.url(resume.publicId, {
    resource_type: resourceType,
    type: "authenticated",
    ...(resourceType === "image" ? { format: "pdf" } : {}),
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });
};

const resumeMetadata = (uploadResult, filename) => ({
  url: uploadResult.secure_url,
  publicId: uploadResult.public_id,
  filename,
});

module.exports = {
  uploadApplicationResume,
  uploadProfileResume,
  deleteResumePdf,
  getSignedResumeUrl,
  resumeMetadata,
  isPdfBuffer,
};
