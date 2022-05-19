const express = require('express');
const { registerUser} = require('../controllers/userController');

const router = express.Router();


//router.route('/products').get(getAllProducts);
router.route('/register').post(registerUser);
//router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getProductDetails);


module.exports = router;