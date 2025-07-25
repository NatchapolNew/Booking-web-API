const renderError = require("../util/renderError");
const {clerkClient} = require('@clerk/express')
exports.authCheck = async(req, res, next) => {
  try {
   const userId = req.auth.userId
   if(!userId){
    return renderError(401,'Unauthorize!!!')
   }
   const user = await clerkClient.users.getUser(userId)
    req.user = user
   
   
   next()
    }
  catch (error) {
    next(error)
  }
};