const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

exports.createImages = async (req, res, next) => {
  try {
    console.log(req.body.image);
    const {image} = req.body
    const result = await cloudinary.uploader.upload(image,{
      public_id: `${Date.now()}`,
      resource_type:"auto",
      folder:'Landmark'
    })

    res.json({ result:result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
