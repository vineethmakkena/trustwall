const crypto = require("crypto");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDirectory = path.resolve(__dirname, "../../uploads");
const mimeToExtension = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadDirectory),
  filename: (req, file, callback) => {
    const extension = mimeToExtension[file.mimetype];
    const filename = `avatar-${Date.now()}-${crypto.randomBytes(16).toString("hex")}${extension}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  if (!mimeToExtension[file.mimetype]) {
    const error = new Error("Only JPG, JPEG, PNG, and WEBP images are allowed");
    error.statusCode = 400;
    error.code = "UNSUPPORTED_IMAGE_TYPE";
    return callback(error);
  }

  callback(null, true);
};

const validateImageSignature = async (file) => {
  const header = await fs.promises.readFile(file.path, { encoding: null, flag: "r" });
  const isJpeg = header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isPng = header.length >= 8 && header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = header.length >= 12 && header.toString("ascii", 0, 4) === "RIFF" && header.toString("ascii", 8, 12) === "WEBP";

  if (!isJpeg && !isPng && !isWebp) {
    const error = new Error("Uploaded file is not a valid image");
    error.statusCode = 400;
    error.code = "INVALID_IMAGE_SIGNATURE";
    throw error;
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

module.exports = uploadAvatar;
module.exports.validateImageSignature = validateImageSignature;
