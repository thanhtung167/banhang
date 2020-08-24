const Products = require('../Model/product')
const User = require('../Model/User')
const Category = require('../Model/category')
const Oder = require('../Model/oder')
const OderDetail = require('../Model/orderDetail')
const Inventory = require('../Model/inventory')
const Branch = require('../Model/branch')
const Unit = require('../Model/Unit')
const JWT = require("jsonwebtoken");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");

const getallBranch = (req,res,next)=>{
  Branch.findAll().then((item)=>{
    res.json({item})
  }).catch(err =>{
    next(err)
  })
}
const newBranch = async (req,res,next)=>{
  const branch_name = req.body.branch_name;
  const address = req.body.address
  await Branch.create({
    branch_name:branch_name,
    address:address
  }).then((branch)=>{
    return res.status(201).json({branch})
   }).catch((err)=>{
     next(err)
   })
}

const deleteBranch = async (req,res,next) =>{
  const BranchId = req.params.BranchId
  await Branch.destroy({
    id:BranchId
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

const editbranch = async (req,res,next) =>{
  const branch_name = req.body.branch_name;
  const address = req.body.address
  await Branch.update({branch_name,address},{returning: true,where:{
    id:req.params.BranchId
  }}).then(([ rowsUpdate, [updatedBranch] ])=>{
    res.json(updatedBranch)
  }).catch(err=>{
    next(err)
  })
}

module.exports = {
  editbranch,deleteBranch,newBranch,getallBranch
}