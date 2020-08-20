const sequelize = require('../config/db')
const { Sequelize, DataTypes } = require('sequelize');
const Category =sequelize.define('Category',{
  id:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  cat_name:{
    type:DataTypes.STRING,
  }
  
  
},{
  timestamps: false,
}) 
module.exports = Category