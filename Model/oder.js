const sequelize = require('../config/db')
const { Sequelize, DataTypes } = require('sequelize');
const Oders =sequelize.define('Oders',{
  oder_id:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  total_amount:{
    type:DataTypes.BIGINT
  }

  
},{
  timestamps: false,
}) 
module.exports = Oders