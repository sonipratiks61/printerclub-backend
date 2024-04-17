
 const express = require('express');
const router = express();
const {userRegister,userLogin,getAllUser}=require('../controller/authController/authController');
const authMiddleware = require('../middleWare/authMiddleWare');
router.post('/register',  userRegister);
router.post('/login',userLogin);
router.get('/allUser',authMiddleware,getAllUser)
module.exports = router;
