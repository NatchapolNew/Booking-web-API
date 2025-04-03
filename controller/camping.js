const prisma = require("../config/prisma");
exports.listCamping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campings = await prisma.landmark.findMany({
      include: {
        favorites: {
          where: {
            profileId: id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const campingWithLike = campings.map((item) => {
      return { ...item, isfavorites: item.favorites.length > 0 };
    });
    res.json({ result: campingWithLike });
  } catch (error) {
    next(error);
  }
};

exports.readCamping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const camping = await prisma.landmark.findFirst({
      where: {
        id: Number(id),
      },
    });

    res.json({ result: camping });
  } catch (error) {
    next(error);
  }
};

exports.createCamping = async (req, res, next) => {
  try {
    console.log(req.body);
    const { id } = req.user;
    const { title, price, description, category, lat, lng, image } = req.body;
    const camping = await prisma.landmark.create({
      data: {
        title: title,
        price: price,
        description: description,
        category: category,
        lat: lat,
        lng: lng,
        public_id: image.public_id,
        secure_url: image.secure_url,
        profileId: id,
      },
    });
    res.json({ message: "CreateCamping Success!!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateCamping = (req, res, next) => {
  try {
    res.send("Hello updateCamping");
  } catch (error) {
    next(error);
  }
};

exports.deleteCamping = (req, res, next) => {
  try {
    res.send("Hello deleteCamping");
  } catch (error) {
    next(error);
  }
};

exports.actionFavorite = async (req, res, next) => {
  try {
    const { isFavorite, campingId } = req.body;
    const { id } = req.user;
    //add or remove
    let result;
    if (isFavorite) {
      result = await prisma.favorite.deleteMany({
        where: {
          profileId: id,
          landmarkId: campingId,
        },
      });
    } else {
      result = await prisma.favorite.create({
        data: {
          landmarkId: campingId,
          profileId: id,
        },
      });
    }

    res.json({
      message: isFavorite ? "Remove Favorite" : "Add Favorite",
      result: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.listFavorites = async (req, res, next) => {
  try {
    const { id } = req.user.id;
    const favorites = await prisma.favorite.findMany({
      where:{
        profileId : id
      },include:{
        Landmark: true
      }
    })
    const favortiesWithLike = favorites.map((item)=>{
      return(
        {...item,
          Landmark:{
          ...item.Landmark,isfavorites:true
        }}
      )
    })
  
    res.json({ message:"success",result:favortiesWithLike});
  } catch (error) {
    next(error);
  }
};
