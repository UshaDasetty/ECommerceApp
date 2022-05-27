// Creating Token and saving in a cookie 

const sendToken = (user, statusCode, res) => {
   const token = user.getJWTToken(); 

   // options for cookie, sets Expiry date for the cookie
   const options = {
       expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
       ),
       httpOnly: true,
   };

   // It will save the token in the cookie 
   res.status(statusCode).cookie("token", token, options).json({
       success: true,
       user,
       token,
   })
};

module.exports = sendToken;

