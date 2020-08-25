const Products = require("../Model/product");
const User = require("../Model/User");
const Category = require("../Model/category");
const Oder = require("../Model/oder");
const OderDetail = require("../Model/orderDetail");
const Inventory = require("../Model/inventory");
const Unit = require("../Model/Unit");
const JWT = require("jsonwebtoken");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");
const { model } = require("mongoose");
const Branch = require("../Model/branch");

const newProduct = async (req, res, next) => {
  const unit_left = req.body.unit_left;
  const BranchId = req.body.BranchId;
  const ProductId = req.body.ProductId;

  const findProduct = await Inventory.findAll({
    where: {
      ProductId: ProductId,
      BranchId: BranchId,
    },
  });
  if (findProduct.length < 1) {
    Inventory.create({
      unit_left: unit_left,
      ProductId: ProductId,
      BranchId: BranchId,
    })
      .then((product) => {
        return res.status(201).json({ product });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.json({ mes: "sản phẩm này đã có trong kho " });
  }
};

const deleteInventory = async (req, res, next) => {
  const InventoryId = req.params.InventoryId;
  await Inventory.destroy({
    id: InventoryId,
  })
    .then((deleteRecord) => {
      if (deleteRecord === 1) {
        res.status(200).json({ mes: "Success" });
      } else {
        res.status(404).json({ mes: "record not found" });
      }
    })
    .catch((error) => {
      next(error);
    });
};

const editInventory = async (req, res, next) => {
  const unit_left = req.body.unit_left;
  const BranchId = req.body.BranchId;
  const ProductId = req.body.ProductId;
  await Inventory.update(
    { unit_left, BranchId, ProductId },
    {
      returning: true,
      where: {
        id: req.params.id_Inventory,
      },
    }
  )
    .then(([rowsUpdate, [updatedInventory]]) => {
      res.json(updatedInventory);
    })
    .catch((err) => {
      next(err);
    });
};
const getUnitProduct = async (req, res, next) => {
  const ProductId = req.body.ProductId;

  const product =  await Inventory.findAll({
    where: {
      ProductId: ProductId,

    },
    include: {
      model: Branch,
    },raw:true
  })
  console.log(product)
 const info = await Products.findOne({
    where:{
      id:ProductId
    },
    attributes:['prd_name']
    ,raw:true
  })
  res.json({mes:{...product,...info}})
};

module.exports = {
  newProduct,
  deleteInventory,
  editInventory,
  getUnitProduct,
};
