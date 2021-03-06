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
    type:DataTypes.INTEGER,
  },
  prd_price_import:{
    type:DataTypes.INTEGER,
  },
  prd_details:{
    type:DataTypes.STRING,
  },
  prd_img:{
  type:DataTypes.STRING,
  }
  
  
},{
  timestamps: true,
}) 
module.exports = Products