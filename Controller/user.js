const Products = require('../Model/product')
const User = require('../Model/User')
const Category = require('../Model/category')
const Oder = require('../Model/oder')
const OderDetail = require('../Model/orderDetail')
const Unit = require('../Model/Unit')
const JWT = require("jsonwebtoken");
const { json } = require('body-parser');
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");
const { model } = require('mongoose')
//?PRODUCT-CATEGORY
Category.hasMany(Products)
Products.belongsTo(Category);

//?USER-ODER
User.hasMany(Oder)
Oder.belongsTo(User);

//?ODER-ODERDETAIL
Oder.hasOne(OderDetail,{onDelete: 'CASCADE',hook:true});
OderDetail.belongsTo(Oder);

//?PRODUC-ODERDETAIL
Products.hasMany(OderDetail)
OderDetail.belongsTo(Products);
//?UNIT-PRODUCT
Unit.hasOne(Products)
Products.belongsTo(Unit);

let tokenList = {};
const encodeToken = (userID) =>{
  return JWT.sign({
    iss:"TT",
    sub:userID,
    iat:new Date().getTime(),
    exp:new Date().setDate(new Date().getDate() + 1),
  },'thanhtung')
}
const encodeTokenfresh = (userID) =>{
  return JWT.sign({
    iss:"TT",
    sub:userID,
    iat:new Date().getTime(),
    exp:new Date().setDate(new Date().getDate() + 10),
  },'thanhtung')
}
const verifyToken =(token,secretKey)=>{
  return new Promise((resolve, reject) => {
    JWT.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
const refreshtoken = async (req,res)=>{

  // User gửi mã refresh token kèm theo trong body
  const refreshTokenFromClient = req.body.refreshToken;
  if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
    try {
      const decoded = await verifyToken(refreshTokenFromClient,'thanhtung')
      console.log(decoded)
    const userData = decoded.sub;
    console.log("userdata" + userData)

    const accessToken = encodeToken(userData._id)
    return res.status(200).json({accessToken});
    } catch (error) {
      res.status(403).json({
        message: 'Invalid refresh token.',
      });
    }
    

  }
  else{
     // Không tìm thấy token trong request
     return res.status(403).send({
      message: 'No token provided.',
    });
  }
}

const newUser = async function(req,res,next){
  const user_email = req.body.user_email;
  const user_fullname = req.body.fullname;
  const user_name = req.body.user_name;
  const user_address = req.body.user_address;
  const user_phone = req.body.user_phone;
  const user_password = req.body.password;
  const foundUser =  await User.findOne({where:{user_email:user_email}})
    if(foundUser !== null) return res.json({messenger:"Tài khoản đã tồn tại "})

    
     await User.create({user_name:user_name,user_email:user_email,user_password:user_password,user_address:user_address,user_phone:user_phone,user_fullname:user_fullname}).then((user)=>{
      return res.status(201).json({user})
     }).catch((err)=>{
       next(err)
     })
}
const Login = async function(req,res){
  const user_email = req.body.user_email;
  const user_password = req.body.password;
  const user =  await User.findAll({where:{user_email:user_email,user_password:user_password},raw:true})
  
    // console.log(tokenList)
   if(user.length <= 0){
    return  res.json({result:"Sai tên đăng nhập hoặc mật khẩu "}) 
   }
   if (user.length <=0 && user[0].password !== user_password) {
   return res.json({result:"Sai tên đăng nhập hoặc mật khẩu"})
  }
      //encode Token
      const token = encodeToken(user[0].id);
      const refreshToken = encodeTokenfresh(user[0].id);
      // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
        tokenList[refreshToken] = {token, refreshToken};
  if (user.length>0) {

    res.setHeader("x-access-token",token)
    return res.status(200).json({result:true,token:token,refreshToken:refreshToken});
  }
      
}

const getAllUser = async(req,res,next) => {
  await User.findAll({attributes:{exclude:['user_password']}}).then((users)=>{
    res.json({users:users})
  }).catch((err)=>{
    next(err)
  })
}
const editUser = async(req,res,next)=>{
  const user_email = req.body.user_email;
  const user_fullname = req.body.fullname;
  const user_name = req.body.user_name;
  const user_address = req.body.user_address;
  const user_phone = req.body.user_phone;
  const user_password = req.body.password;
await Users.update({user_email,user_fullname,user_name,user_address,user_phone,user_password},{returning: true,where:{
  user_id:req.params.id_User
}}).then(([ rowsUpdate, [updatedUser] ])=>{
  res.json(updatedUser)
}).catch(err=>{
  next(err)
})
}

const removeUser = async(req,res,next)=>{
  const { id_user } = req.params

  await Category.destroy({
    where:{
      user_id:id_user
    }
  }).then((deleteRecord)=>{
    if (deleteRecord===1) {
      res.status(200).json({mes:"Success"})
    } else {
      res.status(404).json({mes:"record not found"})
    }
  }).catch((error)=>{
    next(error)
  }
  )
}

const newCategory = async function(req,res,next){
  const  cat_name  = req.body.name
  const FindCate = await  Category.findAll({
    where:{
      cat_name:cat_name
    },raw:true
  })
  if (FindCate.length > 0) {
    return res.json({message:"Đã tồn tại mục này"})
  } else {
    await Category.create({cat_name:cat_name}).then((cat)=>{
    res.json({cat})
  }).catch((err)=>{
    next(err)
  })
  }   
}
const editCategory = async (req,res,next)=>{
  const  cat_name  = req.body.name
  await Category.update({ cat_name: cat_name }, {
    where: {
      id: req.params.id_category
    }
  }).then((cat)=>{
    res.json({mes:"Success",cat})
  }).catch((err)=>{
    next(err)
  });
}
const removeCategory = async(req,res,next)=>{
  const { id_category } = req.params

  await Category.destroy({
    where:{
      id:id_category
    }
  }).then((deleteRecord)=>{
    if (deleteRecord===1) {
      res.status(200).json({mes:"Success"})
    } else {
      res.status(404).json({mes:"record not found"})
    }
  }).catch((error)=>{
    next(error)
  }
  )
}


const newUnit = async function(req,res,next){
  const  unit_name  = req.body.name
  const FindUnit = await  Unit.findAll({
    where:{
      unit_name:unit_name
    },raw:true
  })
  if (FindUnit.length > 0) {
    return res.json({message:"Đã tồn tại mục này"})
  } else {
    await Unit.create({unit_name:unit_name}).then((unit)=>{
    res.json({unit})
  }).catch((err)=>{
    next(err)
  })
  }   
}
const editUnit = async (req,res,next)=>{
  const  unit_name  = req.body.name
  await Unit.update({ unit_name: unit_name }, {
    where: {
      id: req.params.id_unit
    }
  }).then(([rowUpdate,[ unitupdate]])=>{
    res.json({mes:"Success",unitupdate})
  }).catch((err)=>{
    next(err)
  });
}
const removeUnit = async(req,res,next)=>{
  const  id_unit  = req.params

  await Unit.destroy({
    where:{
      id:id_unit
    }
  }).then((deleteRecord)=>{
    if (deleteRecord===1) {
      res.status(200).json({mes:"Success"})
    } else {
      res.status(404).json({mes:"record not found"})
    }
  }).catch((error)=>{
    next(error)
  }
  )
}


const newProduct = async(req,res,next)=>{
 const prd_name = req.body.prd_name
 const prd_price = req.body.prd_price
 const prd_price_import = req.body.prd_price_import
 const prd_details = req.body.prd_details
 const CategoryId = req.body.categoryid
 const UnitId = req.body.unitid
 const prd_img = req.body.prd_img
 const prd_amount = req.body.prd_amount
 await Products.create({prd_name,prd_price,prd_price_import,prd_details,prd_img,prd_amount,CategoryId,UnitId}).then(product=>{
   res.json(product)
 }).catch((err)=>{
   next(err)
 })
}
const getAllProduct = async(req,res,next)=>{
await Products.findAll({include:{model:Unit,attributes:['unit_name']}}).then((product)=>{
  res.json({product})
})
}
const editProduct = async(req,res,next)=>{
  const prd_name = req.body.prd_name
  const prd_price = req.body.prd_price
  const prd_price_import = req.body.prd_price_import
  const prd_details = req.body.prd_details
  const CategoryId = req.body.categoryid
  const UnitId = req.body.unitid
  const prd_img = req.body.prd_img
  const prd_amount = req.body.prd_amount
await Products.update({prd_name,prd_price,prd_price_import,prd_details,prd_img,prd_amount,CategoryId,UnitId},{returning: true,where:{
  id:req.params.id_product
}}).then(([ rowsUpdate, [updatedProduct] ])=>{
  res.json(updatedProduct)
}).catch(err=>{
  next(err)
})
}
const removeProduct = async(req,res,next) =>{
  await Products.destroy({
    where:{
      id:req.params.id_product
    }
  }).then((deleteRecord)=>{
    if (deleteRecord===1) {
      res.status(200).json({mes:"Success"})
    } else {
      res.status(404).json({mes:"record not found"})
    }
  }).catch((error)=>{
    next(error)
  }
  )
}

const newOder = async(req,res,next)=>{
  const amount = req.body.amount
  const price = req.body.prd_price
  const discount = req.body.discount
  const total = req.body.total
  const from = req.body.from
  const total_amount = req.body.total_amount
  const UserUserId = req.body.userid
  const ProductId = req.body.productid
  const ship = req.body.ship
 const oder = await Oder.create({UserUserId:UserUserId,total_amount:total_amount})

const oder2 =  OderDetail.build({amount,price,discount,total,from,ProductId,ship,OderOderId:oder.dataValues.oder_id,raw:true})
const value = oder2.dataValues
const value2 = oder.dataValues
const amountInt = parseInt(value.amount)
const Percen = parseInt(value.discount)
const Ship = parseInt(value.ship)
value.total = (amountInt * value.price *((100-Percen)/100)) - Ship
value2.total_amount = value.total
await oder2.save()
await Oder.update({total_amount:value.total},{
  where:{
    oder_id:oder.dataValues.oder_id
  }
})
res.json({oder2})
}
const getAllODer = async(req,res,next)=>{
  await Oder.findAll({include:{model:User,attributes:['user_name','user_address','user_phone',]}}).then((Oder)=>{
    res.json({Oder})
  }).catch((err)=>{
    next(err)
  })
}
const getDetailOder = async (req,res,next) =>{
  const id = req.params.id
  await OderDetail.findAll({
    where:{
      id:id
    }
    ,include:{model:Oder,attributes:['oder_id'],include:[{model:User,attributes:['user_name','user_address','user_phone','user_email']}]}
  }).then((oder)=>{
    res.json({oder})
  }).catch(err=>{
    next(err)
  })
}
const editODer = async (req,res,next) =>{
  const amount = req.body.amount
  const price = req.body.prd_price
  const discount = req.body.discount
  const total = req.body.total
  const from = req.body.from
  const total_amount = req.body.total_amount
  const status = req.body.status
  const ProductId = req.body.productid
  const ship = req.body.ship
  const oder = await Oder.update({total_amount:total_amount},{where:{
    oder_id:req.params.id
  }})
  await OderDetail.update({amount,price,discount,total,from,status,ProductId,ship},{where:{
    id:req.params.id
  },returning:true}).then(([ rowsUpdate, [updatedIOder] ])=>{
    res.json(updatedIOder)
  }).catch((err)=>{
    next(err)
  })
}

const  deleteOder = async (req,res,next) =>{
  const id = req.params.id
  await Oder.destroy({
    where:{
      oder_id:id
    }
  }).then((deleteRecord)=>{
    if (deleteRecord===1) {
      res.status(200).json({mes:"Success"})
    } else {
      res.status(404).json({mes:"record not found"})
    }
  }).catch(err=>{
    next(err)
  })
}



module.exports = {
  Login, newUser, newCategory, newProduct, removeCategory, encodeToken ,encodeTokenfresh,verifyToken,refreshtoken,editODer
  ,editCategory,newUnit,editUnit,removeUnit,getAllProduct,editProduct,removeProduct,newOder,getAllODer,getDetailOder,deleteOder,getAllUser,editUser,removeUser
}