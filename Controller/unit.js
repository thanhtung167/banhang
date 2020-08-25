const Products = require("../Model/product");
const User = require("../Model/User");
const Category = require("../Model/category");
const Oder = require("../Model/oder");
const OderDetail = require("../Model/orderDetail");
const Unit = require("../Model/Unit");
const JWT = require("jsonwebtoken");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");

const getAllUnit = async function (req, res, next) {
  await Unit.findAll()
    .then((unit) => {
      res.json({ unit });
    })
    .catch((err) => {
      next(err);
    });
};

const newUnit = async function (req, res, next) {
  const unit_name = req.body.name;
  const FindUnit = await Unit.findAll({
    where: {
      unit_name: unit_name,
    },
    raw: true,
  });
  if (FindUnit.length > 0) {
    return res.json({ message: "Đã tồn tại mục này" });
  } else {
    await Unit.create({ unit_name: unit_name })
      .then((unit) => {
        res.json({ unit });
      })
      .catch((err) => {
        next(err);
      });
  }
};
const editUnit = async (req, res, next) => {
  const unit_name = req.body.name;
  await Unit.update(
    { unit_name: unit_name },
    {
      where: {
        id: req.params.id_unit,
      },
    }
  )
    .then(([rowUpdate, [unitupdate]]) => {
      res.json({ mes: "Success", unitupdate });
    })
    .catch((err) => {
      next(err);
    });
};
const removeUnit = async (req, res, next) => {
  const id_unit = req.params;

  await Unit.destroy({
    where: {
      id: id_unit,
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
  getAllUnit,
  newUnit,
  editUnit,
  removeUnit,
};
