const {Product }= require('../../models')
const {sendInternalError,sendSuccess}=require('../../utils/customResponse')
exports.productCreateOne = async (req, res) => {
    try {
   const {productName,address,city,state,mobile,seller}=req.body;
        await Product.create({
        userId: req.userId,
       productName,address,city,state,mobile,seller
        
      });
      return sendSuccess(res, 'Product created successfully');
    } catch (err) {
      console.log(err)
      return sendInternalError(res, 'Something went wrong');
    }
  };