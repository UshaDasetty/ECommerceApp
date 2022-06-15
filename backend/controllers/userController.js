const User = require('../models/UserModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');

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

    // if user found, Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    // 
    await user.save({ validateBeforeSave: false});

    // Url(link) to reset the password
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    console.log(`resetToken : ${resetToken}`)

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

// Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest("hex");


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    });

    // If user not found 
    if(!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has been expired", 400));
    }

    // if password and confirm password does not match
    if( req.body.password !== req.body.confirmPassword ) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // if password and confirm password matched, it update the password 
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // saves updated password(user) to database
    await user.save();

    // it send response i.e., user and token
    sendToken(user, 200, res);

});




/******************************************************************************/
/******************************************************************************/

// Get User details 

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    // if user found
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
});

/******************************************************************************/

// update User password 

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    // It find user and selects password to update password
    const user = await User.findById(req.user.id).select("+password");

    // It compares the Entered password with old Password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    // If password is not matched with old password
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is Incorrect", 400));
    }

    // if new password and confirm password is not same
    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // if new password and confirm password is same, it update password with new password
    user.password = req.body.newPassword;

    // saves updated password(user) to database
    await user.save();

    sendToken(user, 200, res);
});

/******************************************************************************/
