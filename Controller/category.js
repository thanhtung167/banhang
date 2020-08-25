const Products = require("../Model/product");
const User = require("../Model/User");
const Category = require("../Model/category");
const Oder = require("../Model/oder");
const OderDetail = require("../Model/orderDetail");
const Unit = require("../Model/Unit");
const JWT = require("jsonwebtoken");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");

const newCategory = async function (req, res, next) {
  const cat_name = req.body.name;
  const FindCate = await Category.findAll({
    where: {
      cat_name: cat_name,
    },
    raw: true,
  });
  if (FindCate.length > 0) {
    return res.json({ message: "Đã tồn tại mục này" });
  } else {
    await Category.create({ cat_name: cat_name })
      .then((cat) => {
        res.json({ cat });
      })
      .catch((err) => {
        next(err);
      });
  }
};
const editCategory = async (req, res, next) => {
  const cat_name = req.body.name;
  await Category.update(
    { cat_name: cat_name },
    {
      where: {
        id: req.params.id_category,
      },
    }
  )
    .then((cat) => {
      res.json({ mes: "Success", cat });
    })
    .catch((err) => {
      next(err);
    });
};
const removeCategory = async (req, res, next) => {
  const { id_category } = req.params;

  await Category.destroy({
    where: {
      id: id_category,
    },
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
const getAllCate = async function (req, res, next) {
  await Category.findAll()
    .then((cate) => {
      res.json({ cate });
    })
    .catch((err) => {
      next(err);
    });
};
//?PRODUCT-CATEGORY
Category.hasMany(Products);
Products.belongsTo(Category);

//?USER-ODER
User.hasMany(Oder);
Oder.belongsTo(User);

//?ODER-ODERDETAIL
Oder.hasOne(OderDetail, { onDelete: "CASCADE", hook: true });
OderDetail.belongsTo(Oder);

//?PRODUC-ODERDETAIL
Products.hasMany(OderDetail);
OderDetail.belongsTo(Products);
//?UNIT-PRODUCT
Unit.hasOne(Products);
Products.belongsTo(Unit);

module.exports = {
  newCategory,
  editCategory,
  removeCategory,
  getAllCate,
};
