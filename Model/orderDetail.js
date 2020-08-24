const sequelize = require('../config/db')
const { Sequelize, DataTypes } = require('sequelize');
const Inventory = require('../Model/inventory')
const OderDetail =sequelize.define('OderDetail',{
  amount:{
    type:DataTypes.BIGINT
  },
  price:{
    type:DataTypes.BIGINT
  },
  discount:{
    type:DataTypes.STRING
  },
  total:{
    type:DataTypes.BIGINT
  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  from:{
    type: DataTypes.STRING,
    allowNull: false
  },ship:{
    type:DataTypes.BIGINT,
    allowNull: true

  }

},{
  timestamps: true,
},{
 
}) 
module.exports = OderDetail