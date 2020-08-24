const sequelize = require('../config/db')
const { Sequelize, DataTypes } = require('sequelize');
const Branch =sequelize.define('Branch',{
  id:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  branch_name:{
    type:DataTypes.STRING
  }
  ,    address:{
    type:DataTypes.STRING
  },

  
},{
  timestamps: false,
}) 
module.exports = Branch