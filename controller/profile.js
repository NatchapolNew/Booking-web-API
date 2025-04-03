const renderError = require("../util/renderError");
const prisma = require("../config/prisma");

exports.createProfile = async(req, res, next) => {
  try {
    const { firstname, lastname } = req.body;
    const {id} = req.user
    const email = req.user.emailAddresses[0].emailAddress

      // const profile = await prisma.profile.create({
      //   data:{
      //     clerkId:id,
      //     firstname:firstname,
      //     lastname:lastname,
      //     email:email
      //   }
      // })
    
      //การcreateแบบถ้ามีอยู่แล้วupdate ถ้าไม่มีcreateแทน
      const profile =await prisma.profile.upsert({
        where:{clerkId:id},
        create:{
          firstname,
          lastname,email,  //เขียนแบบshorthand
          clerkId:id
        },update:{
          firstname,
          lastname,
          email
        }
      })


    console.log(firstname,lastname,id,email);
    

  
    res.json({result:profile,message: "Create Profile Success" });
    //res.data.message
  } catch (error) {
    console.log(error.message);
    next(error);
    //     console.log(error);
    //     throw new Error
    //     res.status(500).json({ message: "Server Error" });
    //   }
  }
};
