const express = require("express");
const router = express.Router();
//controller
const { createProfile } = require("../controller/profile");
const { authCheck } = require("../middlewares/Auth");
//@END POINT http://localhost:5000/api/profile

router.post("/profile",authCheck, createProfile);

module.exports = router;
