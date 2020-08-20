const sequelize = require('../config/db')
const { Sequelize, DataTypes } = require('sequelize');
const Users =sequelize.define('Users',{
  user_id:{
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull:false
  },
  user_name:{
    type:DataTypes.STRING,
  },
  user_address:{
    type:DataTypes.STRING,
  },
  user_phone:{
    type:DataTypes.STRING,
  },
  user_email:{
    type:DataTypes.STRING,
    unique:true
  },
  user_password:{
    type:DataTypes.STRING,
  },
  user_fullname:{
    type:DataTypes.STRING,
  },
  role:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false,

  }
  
},{
  timestamps: true,
}) 
module.exports = Users