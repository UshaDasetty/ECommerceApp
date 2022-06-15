const express = require('express');
const { isAuthenticatedUser, autherizeRoles } = require('../middleware/auth');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');

const router = express.Router();


router.route('/products').get(getAllProducts);  

router.route('/product/new').post(isAuthenticatedUser, autherizeRoles("admin"), createProduct); // It allows only the admin to create a product.

router.route('/product/:id')
    .put(isAuthenticatedUser, autherizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, autherizeRoles("admin"), deleteProduct);

router.route('/product/:id').get(getProductDetails);


module.exports = router;