// import express
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const { readdirSync } = require("fs");
const handleError = require("./middlewares/error");
require('dotenv/config')
const {clerkMiddleware} = require('@clerk/express')
// const campingRoute = require("./routes/camping");
// const profileRoute = require("./routes/profile");

//middleware
app.use(cors());
app.use(express.json({limit:"10mb"}));
app.use(morgan("dev"));
app.use(clerkMiddleware())
//method GET,POST,PUT,PATCH,DELETE

console.log(readdirSync("./routes"));

readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));
// app.use('/api',campingRoute)
// app.use('/api',profileRoute)
//  app.get('/',(req,res)=>{
//     res.json({message:'Hello'})
//  })

app.use(handleError);

const PORT = 5000;
app.listen(5000, () => console.log(`Server is running on port ${PORT}`));
