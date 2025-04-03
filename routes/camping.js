const express = require("express");
const router = express.Router();
//middleware
const {authCheck} = require("../middlewares/Auth")
//controller
const {
  listCamping,
  readCamping,
  createCamping,
  updateCamping,
  deleteCamping,
  actionFavorite,
  listFavorites
} = require("../controller/camping");



//@ENDPOINT http://localhost:5000/api/camping
//@method GET[read]
//@Access public
router.get("/camping/:id",  readCamping);

//@ENDPOINT http://localhost:5000/api/camping
//@method GET[list]
//@Access public
router.get("/campings/:id", listCamping);

//@ENDPOINT http://localhost:5000/api/camping
//@method post [create camping]
//@Access public
router.post("/camping",authCheck, createCamping);

//@ENDPOINT http://localhost:5000/api/camping
//@method put [update camping]
//@Access public
router.put("/camping/:id",authCheck, updateCamping);

//@ENDPOINT http://localhost:5000/api/camping
//@method delete [delete camping]
//@Access public
router.delete("/camping/:id",authCheck, deleteCamping);

//Favorite Route
router.post("/favorite",authCheck,actionFavorite)
router.get("/favorites",authCheck,listFavorites)

module.exports = router;
