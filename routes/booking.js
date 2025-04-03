const express = require("express");
const router = express.Router();
//controller
const {
  createBooking,
  checkout,
  checkoutStatus,
  listBookings,
} = require("../controller/booking");
const { authCheck } = require("../middlewares/Auth");
//@END POINT http://localhost:5000/api/booking

router.post("/booking", authCheck, createBooking);

//@Payment
//@END POINT http://localhost:5000/api/checkout
router.post("/checkout", authCheck, checkout);
router.get("/checkout-status/:session_id", authCheck, checkoutStatus);

//@END POINT http://localhost:5000/api/booking
router.get("/booking", authCheck, listBookings);

module.exports = router;
