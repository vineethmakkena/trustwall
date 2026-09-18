const express = require("express");
const { getPublicWall } = require("../controllers/publicWallController");

const router = express.Router();

router.get("/spaces/:slug/wall", getPublicWall);

module.exports = router;
