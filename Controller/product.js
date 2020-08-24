const Products = require('../Model/product')
const User = require('../Model/User')
const Category = require('../Model/category')
const Oder = require('../Model/oder')
const OderDetail = require('../Model/orderDetail')
const Unit = require('../Model/Unit')
const JWT = require("jsonwebtoken");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");



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


 module.exports = {
  newProduct,getAllProduct,editProduct,removeProduct
 }


