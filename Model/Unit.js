const sequelize = require('../config/db')
const { Sequelize, DataTypes } = require('sequelize');
const Unit =sequelize.define('Unit',{
  id:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  unit_name:{
    type:DataTypes.STRING,
    allowNull:false
  }
  
  
},{
  timestamps: true,
}) 
module.exports = Unit