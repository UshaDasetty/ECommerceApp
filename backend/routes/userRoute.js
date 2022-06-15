const express = require('express');
const { isAuthenticatedUser, autherizeRoles } = require('../middleware/auth');
const { registerUser, loginUser, forgotPassword, logoutUser, resetPassword,    
        getUserDetails, updatePassword, updateProfile,
        getAllUsers, getSingleUser, } = require('../controllers/userController');

const router = express.Router();


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logoutUser);

router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, autherizeRoles("admin"), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, autherizeRoles("admin"), getSingleUser);


module.exports = router;