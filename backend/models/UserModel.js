const mongoose = require('mongoose'); 
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please Enter your name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name should have at least 4 characters"],
    },

    email: {
        type: String,
        required:[true, "Please Enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
        type: String,
        required:[true, "Please Enter your password"],
        minLength:[8, "Password should have at least 8 characters"],
        select: false,
    },

    avatar: {
        
            public_id: {
                type: String,
                required:true,
            },
    
            url: {
                type: String,
                required:true,
            },
    },

    role: {
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

/******************************************************************************/

// It will bcrypt the password before saving to the database.
userSchema.pre("save", async function (next) {    // we are not using arrow functions here, because it don't allow this keyword.
    if(!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

/******************************************************************************/

// JWT TOKEN
// to create unique token i.e., credentials to the user based on the user _id
userSchema.methods.getJWTToken = function () {
    return jwt.sign( {id: this.id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

/******************************************************************************/

module.exports = mongoose.model("User", userSchema);