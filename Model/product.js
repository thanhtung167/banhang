const sequelize = require('../config/db')
const { Sequelize, DataTypes } = require('sequelize');
const Products =sequelize.define('Products',{
  id:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  prd_name:{
    type:DataTypes.STRING,
  },
  prd_price:{
    type:DataTypes.STRING,
  },
  prd_price_import:{
    type:DataTypes.STRING,
  },
  prd_details:{
    type:DataTypes.STRING,
  },
  prd_img:{
  type:DataTypes.STRING,
  },
  prd_amount:{
    type:DataTypes.INTEGER
  }
  
  
},{
  timestamps: true,
}) 
module.exports = Products