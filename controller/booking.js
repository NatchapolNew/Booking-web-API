const prisma = require("../config/prisma");
const { calTotal } = require("../util/booking");
const renderError = require("../util/renderError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.createBooking = async (req, res, next) => {
  try {
    //step1 destructuring req.body
    const { campingId, checkIn, checkOut } = req.body;
    const { id } = req.user;
    //step2 delete booking
    await prisma.booking.deleteMany({
      where: {
        profileId: id,
        paymentStatus: false,
      },
    });
    //step3 find camping
    const camping = await prisma.landmark.findFirst({
      where: {
        id: campingId,
      },
      select: {
        price: true,
      },
    });
    if (!camping) {
      return renderError(400, "Camping Not Found");
    }
    //step4 calculate total
    const { total, totalNights } = calTotal(checkIn, checkOut, camping.price);
    console.log(total, totalNights);
    //step5 insert to db
    const booking = await prisma.booking.create({
      data: {
        profileId: id,
        landmarkId: campingId,
        checkIn: checkIn,
        checkOut: checkOut,
        total: total,
        totalNights: totalNights,
      },
    });
    const bookingId = booking.id;
    //step6 send id booking to react
    res.json({ message: "Booking Success!!", result: bookingId });
  } catch (error) {
    next(error);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const { id } = req.body;
    //step1 find booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        Landmark: {
          select: {
            id: true,
            secure_url: true,
            title: true,
          },
        },
      },
    });

    if (!booking) {
      return renderError(404, "Not Found Booking");
    }

    const { total, totalNights, checkIn, checkOut, Landmark } = booking;
    const { title, secure_url } = Landmark;

    //step2 Stripe payment
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { bookingId: booking.id },
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          quantity: 1,
          price_data: {
            currency: "thb",
            product_data: {
              name: title,
              images: [secure_url],
              description: "Thx you",
            },
            unit_amount: total * 100,
          },
        },
      ],
      mode: "payment",
      return_url: `http://localhost:5173/user/complete/{CHECKOUT_SESSION_ID}`,
    });
    res.send({ clientSecret: session.client_secret });

    console.log(
      title,
      secure_url,
      total,
      totalNights,
      checkIn,
      checkOut,
      Landmark
    );
  } catch (error) {
    next(error);
  }
};

exports.checkoutStatus = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const bookingId = session.metadata?.bookingId;

    //Check
    if (session.status !== "complete" || !bookingId) {
      return renderError(400, "Something wrong!!");
    }

    //Update DB PaymentStatus
    await prisma.booking.update({
      where: {
        id: Number(bookingId),
      },
      data: {
        paymentStatus: true,
      },
    });
    res.json({ message: "Payment Success!!", status: session.status });
    console.log(session);
  } catch (error) {
    next(error);
  }
};

exports.listBookings = async (req, res, next) => {
  try {
    const { id } = req.user;
    const bookings = await prisma.booking.findMany({
      where:{
        profileId:id,
        paymentStatus:true
      },
      include:{
        Landmark:{
          select:{
            id:true,
            title:true
          }
        }
      },
      orderBy:{
        checkIn:"asc"
      }
    })
    res.json({result:bookings});
  } catch (error) {
    next(error);
  }
};
