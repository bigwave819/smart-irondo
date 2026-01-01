import multer from "multer";
import path from "path";

/* ===========================
   CONSTANTS
=========================== */
const ALLOWED_IMAGE_EXTS = [".jpeg", ".jpg", ".png", ".webp"];
const ALLOWED_VIDEO_EXTS = [".mp4", ".mov", ".avi", ".mkv"];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 5;

/* ===========================
   STORAGE (MEMORY)
=========================== */
const storage = multer.memoryStorage();

/* ===========================
   FILE FILTER
=========================== */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();

  const isImage = ALLOWED_IMAGE_EXTS.includes(ext);
  const isVideo = ALLOWED_VIDEO_EXTS.includes(ext);

  const validMime =
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/");

  if ((isImage || isVideo) && validMime) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (jpg,png,webp) and videos (mp4,mov,avi,mkv) are allowed."
      )
    );
  }
};

/* ===========================
   EXPORT UPLOAD
=========================== */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});
