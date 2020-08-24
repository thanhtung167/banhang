const sequelize = require('../config/db')
const OderDetail = require('../Model/orderDetail')
const { Sequelize, DataTypes } = require('sequelize');
const Inventory =sequelize.define('Inventory',{
  id:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  unit_left:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },
  address:{
    type:DataTypes.STRING,
  },
  
  
},{
  timestamps: true,
},{
  
  
}) 
module.exports = Inventory