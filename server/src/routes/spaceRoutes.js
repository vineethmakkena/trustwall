const express = require("express");
const {
  createSpace,
  getSpaces,
  getSpace,
  updateSpace,
  deleteSpace,
} = require("../controllers/spaceController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").post(createSpace).get(getSpaces);
router.route("/:id").get(getSpace).patch(updateSpace).delete(deleteSpace);

module.exports = router;
