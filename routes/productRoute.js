const express = require('express');
const router = express();
const {productCreateOne}=require('../controller/productController/productController');
const authMiddleware = require('../middleWare/authMiddleWare');
router.post('/product',authMiddleware, productCreateOne);
module.exports = router;
