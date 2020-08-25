const Products = require("../Model/product");
const User = require("../Model/User");
const Category = require("../Model/category");
const Oder = require("../Model/oder");
const OderDetail = require("../Model/orderDetail");
const Unit = require("../Model/Unit");
const Inventory = require("../Model/inventory");
const JWT = require("jsonwebtoken");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");

const newOder = async (req, res, next) => {
  const amount = req.body.amount;
  const price = req.body.prd_price;
  const discount = req.body.discount;
  const total = req.body.total;
  const from = req.body.from;
  const total_amount = req.body.total_amount;
  const UserUserId = req.body.userid;
  const ProductId = req.body.productid;
  const ship = req.body.ship;
  const user_fullname = req.body.user_fullname;
  const user_email = req.body.user_email;
  const user_phone = req.body.user_phone;
  const user_address = req.body.user_address;
  const prd_name = req.body.prd_name;
  const BranchId = req.body.BranchId;

  const findProduct = await Products.findAndCountAll({
    where: {
      id: ProductId,
      prd_price: price,
      prd_name: prd_name,
    },
  });
  const findUser = await User.findAndCountAll({
    where: {
      user_id: UserUserId,
      user_fullname: user_fullname,
      user_email: user_email,
      user_phone: user_phone,
      user_address: user_address,
    },
    raw: true,
  });
  if (findUser.count >= 1 && findProduct.count >= 1) {
    const oder = await Oder.create({
      UserUserId: UserUserId,
      total_amount: total_amount,
    });

    const oder2 = OderDetail.build({
      amount,
      price,
      discount,
      total,
      from,
      ProductId,
      ship,
      OderOderId: oder.dataValues.oder_id,
      BranchId,
      raw: true,
    });
    const oder3 = await Inventory.findOne({
      where: {
        ProductId: ProductId,
      },
    });
    console.log(oder3);
    const value = oder2.dataValues;
    const value2 = oder.dataValues;
    const value3 = oder3.dataValues;
    const amountInt = parseInt(value.amount);
    const Percen = parseInt(value.discount);
    const Ship = parseInt(value.ship);
    value.total = amountInt * value.price * ((100 - Percen) / 100) - Ship;
    value2.total_amount = value.total;
    const unit_left = value3.unit_left - amountInt;
    await oder2.save();
    await Oder.update(
      { total_amount: value.total },
      {
        where: {
          oder_id: oder.dataValues.oder_id,
        },
      }
    );
    await Inventory.update(
      { unit_left: unit_left },
      {
        where: {
          ProductId: ProductId,
        },
      }
    );

    res.json({ oder2 });
  } else {
    res.json({ mes: "giá trị nhập chưa đúng" });
  }
};
const getAllODer = async (req, res, next) => {
  await Oder.findAll({
    include: {
      model: User,
      attributes: ["user_name", "user_address", "user_phone"],
    },
  })
    .then((Oder) => {
      res.json({ Oder });
    })
    .catch((err) => {
      next(err);
    });
};
const getDetailOder = async (req, res, next) => {
  const id = req.params.id;
  await OderDetail.findAll({
    where: {
      id: id,
    },
    include: {
      model: Oder,
      attributes: ["oder_id"],
      include: [
        {
          model: User,
          attributes: ["user_name", "user_address", "user_phone", "user_email"],
        },
      ],
    },
  })
    .then((oder) => {
      res.json({ oder });
    })
    .catch((err) => {
      next(err);
    });
};
const editODer = async (req, res, next) => {
  const amount = req.body.amount;
  const price = req.body.prd_price;
  const discount = req.body.discount;
  const total = req.body.total;
  const from = req.body.from;
  const total_amount = req.body.total_amount;
  const status = req.body.status;
  const ProductId = req.body.productid;
  const ship = req.body.ship;
  const oder = await Oder.update(
    { total_amount: total_amount },
    {
      where: {
        oder_id: req.params.id,
      },
    }
  );
  await OderDetail.update(
    { amount, price, discount, total, from, status, ProductId, ship },
    {
      where: {
        id: req.params.id,
      },
      returning: true,
    }
  )
    .then(([rowsUpdate, [updatedIOder]]) => {
      res.json(updatedIOder);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteOder = async (req, res, next) => {
  const id = req.params.id;
  await Oder.destroy({
    where: {
      oder_id: id,
    },
  })
    .then((deleteRecord) => {
      if (deleteRecord === 1) {
        res.status(200).json({ mes: "Success" });
      } else {
        res.status(404).json({ mes: "record not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const findOder = async (req, res, next) => {
  const BranchId = req.body.BranchId;
  const username = req.body.name;
  const user_address = req.body.user_address;
  const user_phone = req.body.user_phone;
  const user_email = req.body.user_email;
  const oder_id = req.body.oder_id;

  await OderDetail.findAll({
    where: {
      BranchId: BranchId,
    },
    include: {
      model: Oder,
      attributes: ["oder_id"],
      where:{
        oder_id:oder_id
      },
      include: [
        {
          model: User,
          attributes: ["user_name", "user_address", "user_phone", "user_email"],
          where: {
            user_name: {
              [Op.like]: "%" + username + "%",
            }
          },
        },
      ],
    },
  })
    .then((oder) => {
      res.json({ oder });
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
  newOder,
  getAllODer,
  getDetailOder,
  editODer,
  deleteOder,
  findOder,
};
