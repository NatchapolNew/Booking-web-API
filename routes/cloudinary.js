const express = require("express");
const router = express.Router();
//controller
const { authCheck } = require("../middlewares/Auth");
const { createImages } = require("../controller/cloudinary");
//@END POINT http://localhost:5000/api/images

router.post("/images",authCheck,createImages);

module.exports = router;
