'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Address, {
        foreignKey: 'userId',
      });
    }
   
  }
  
  User.init({
    businessName: DataTypes.STRING,
    name: DataTypes.STRING,
    gstNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    referenceBy: DataTypes.STRING,
    approveUser:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
   
  });
  return User;
};