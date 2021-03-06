const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');

/******************************************************************************/

//Create Product---> admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    // It will shows the user(admin) id that who created that product 
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product       //displays product details
    });
});

/******************************************************************************/

// getting all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const productCount = await Product.countDocuments();
    const resultPerPage = 5;
    const apifeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apifeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount,
    });
});

/******************************************************************************/

// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

/******************************************************************************/

//Update Product---> admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });
});

/******************************************************************************/

// Delete product---> admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});

/******************************************************************************/