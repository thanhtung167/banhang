const express = require('express')
const app = express()
const port = 3000;
const UserRouter = require('./Router/user')
const bodyParser = require('body-parser')
const logger = require('morgan')
const sequelize = require('./config/db')



app.listen(port, () => {
  
   sequelize.sync({force:false}).then(()=>{
  console.log('Connection has been established successfully.');
  console.log(` app listening at http://localhost:${port}`)

}).catch((error)=>{
  console.error('Unable to connect to the database:', error);

})
})

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users',UserRouter)

//Catch 404
app.use((req,res,next)=>{
  const err = new Error('not found')
  err.status = 404
  next(err)
})
//Error handle
app.use((err,req,res,next)=>{
  const error = app.get('env') === 'development' ? err:{}
  const status = err.status || 500
  // Response to client
  return res.status(status).json({
    error:{
      message: error.message
    }
  })
})



 