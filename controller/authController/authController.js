const { User, Address,Sequelize } = require('../../models')
const { sendBadRequest, sendCreateObject,sendInternalError, sendSuccess } = require('../../utils/customResponse')
const jwt = require("jsonwebtoken");
const { passwordCompare, passwordEncryption } = require('../../utils/bcrypt/index')
const jwtSecret = process.env.JWT_SECRET || "your_secret_key";

exports.userRegister = async (req, res) => {
  try {
    const { businessName, name, email, gstNumber, phoneNumber, password, referenceBy, country, state, city, pincode, address } = req.body;

    const findUser = await User.findOne({ where: { phoneNumber } });

    if (findUser) {
      return sendBadRequest(
        res,
        `User already exists with this WhatsApp number: ${findUser.phoneNumber}`
      );
    }
    const encPass = await passwordEncryption(password);
    const user = await User.create({
      businessName, name, email, gstNumber, phoneNumber, password: encPass, referenceBy,
    });
    if (user) {
      await Address.create({ userId: user.id, country, state, city, pincode, address });
    }
    return sendCreateObject(
      res,
      "Account has been successfully registered",

    );
  } catch (error) {
    const errMsg = error.message;
    console.log(error);
    return sendBadRequest(res, errMsg);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return sendBadRequest(res, "Please check your credentials");
    }

    const isPasswordValid = await passwordCompare(password, user.password);
    if (!isPasswordValid) {
      return sendBadRequest(res, "Please check your password");
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '30d' });

    const data = {
      id: user.id,
      name: user.yourName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token,

    };
    return sendSuccess(res, "Authentication successful", data);
  } catch (error) {

    console.log(error);
    const errMsg = error.message;
    return sendInternalRequest(res, errMsg);
  }
};

exports.getAllUser = async (req, res) => {
  try {
      const users = await User.findAll({
      attributes: [
        'id',
        'businessName',
        'name',
        'email',
        'phoneNumber',
        'referenceBy',
        'approveUser'
      ],
      include: [
        {
          model: Address, 
          attributes: ['userId','address', 'pincode', 'city','state', 'country'], 
        },
      ],
      where:{
      
          id: { [Sequelize.Op.not]: req.userId },
       
      },
     
    });
    return sendSuccess(res, 'Get All User Successfully', users);
  } catch (error) {
    return sendInternalError(res, error.message);
  }
};