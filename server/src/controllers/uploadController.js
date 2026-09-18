const { validateImageSignature } = require("../middleware/uploadMiddleware");

const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an avatar image",
    });
  }

  try {
    await validateImageSignature(req.file);
  } catch (error) {
    const fs = require("fs");
    await fs.promises.unlink(req.file.path).catch(() => {});
    throw error;
  }

  const protocol = req.get("x-forwarded-proto")?.split(",")[0] || req.protocol;
  const imageUrl = `${protocol}://${req.get("host")}/uploads/${encodeURIComponent(req.file.filename)}`;

  return res.status(201).json({
    success: true,
    message: "Avatar uploaded successfully",
    data: {
      url: imageUrl,
    },
  });
};

module.exports = {
  uploadAvatar,
};
