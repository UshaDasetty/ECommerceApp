// auth.js is used, After User/Admin Login to the website, have to authenticate the user/admin to access the website.

const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

/******************************************************************************/

// Authenticate User to access website

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    // If the User not logged in, it does not send token
    if(!token) {
        return next(new ErrorHandler("Please Login to access this resource", 402));
    }


    // if token found, it will verify the token of the Logged in User using user id, then it will give access to the resource(data) of that User.
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();

    // console.log(token);
});

/******************************************************************************/

// Authenticate only Admin to access and maintain the website

exports.autherizeRoles = (...roles) => {
    return (req, res, next) => {

        // If he is not admin, he is not allowed to access the admin resource
        if(!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            )
        }

        next();
    };
};

/******************************************************************************/