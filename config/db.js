const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres','postgres','1671999',{
  host:'localhost',
  dialect: 'postgres',

  pool: {
      max: 5,
      min: 0,
      idle: 10000
  },
})
module.exports = sequelize