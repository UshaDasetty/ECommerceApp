const User = require('../models/UserModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js');

/******************************************************************************/

// Register a User 
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicUrl",
        },
    });

    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     token,
    //    // user,
    // });

    sendToken(user, 201, res);

});

/******************************************************************************/

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //checking if the user has given email and password
    if(!email || !password) {
        return next(new ErrorHandler("Please Enter your email and password", 400));
    }


    // if user not exist
    const user = await User.findOne({ email }).select("+password");
    if(!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }


    // if password is incorrect
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }


    // if email and password are correct
    sendToken(user, 201, res);
    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success: true,
    //     token,
    //    // user,
    // });

});

/******************************************************************************/

// Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

    // It removes token from the cookie, which means that the user is logged out
    res.cookie("token", null, { 
        expires: new Date(Date.now()),
        httpOnly: true,
    });


    res.status(200).json({
        success: true,
        message: "Logged Out successfully"
    });
});

/******************************************************************************/

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    // We have to find the user email whom want to reset the password
    const user = await User.findOne({ email: req.body.email });

    // If the user not found through error
    if(!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    // 
    await user.save({ validateBeforeSave: false});

    // Url(link) to reset the password
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your Password Reset Token is:- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email, please ignore it.`;

    try {
        
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }
});

/******************************************************************************/
