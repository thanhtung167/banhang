const Products = require("../Model/product");
const User = require("../Model/User");
const Category = require("../Model/category");
const Oder = require("../Model/oder");
const OderDetail = require("../Model/orderDetail");
const Inventory = require("../Model/inventory");
const Unit = require("../Model/Unit");
const Branch = require("../Model/branch");
const JWT = require("jsonwebtoken");
const { Sequelize, Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require("../Config/db");
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

Products.hasMany(
  Inventory,
  {
    foreignKey: {
      name: "ProductId",
    },
  },
  { onDelete: true, hook: true }
);
Inventory.belongsTo(Products);

Branch.hasOne(Inventory);
Inventory.belongsTo(Branch, {
  onDelete: true,
  hook: true,
});

Branch.hasMany(OderDetail);
OderDetail.belongsTo(Branch);

let tokenList = {};
const encodeToken = (userID, role) => {
  return JWT.sign(
    {
      iss: "TT",
      sub: { userID, role },
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    "thanhtung"
  );
};
const encodeTokenfresh = (userID, role) => {
  return JWT.sign(
    {
      iss: "TT",
      sub: { userID, role },
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 10),
    },
    "thanhtung"
  );
};
const verifyToken = (token, secretKey) => {
  JWT.verify(token, secretKey);
};
const refreshtoken = async (req, res) => {
  // User gửi mã refresh token kèm theo trong body
  const refreshTokenFromClient = req.body.refreshToken;
  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      const decoded = await JWT.verify(refreshTokenFromClient, "thanhtung");
      console.log(decoded);
      const userData = decoded.sub;
      console.log("userdata" + userData);

      const accessToken = encodeToken(userData.user_id, userData.role);
      return res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({
        message: "Invalid refresh token.",
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

const newUser = async function (req, res, next) {
  const user_email = req.body.user_email;
  const user_fullname = req.body.fullname;
  const user_name = req.body.user_name;
  const user_address = req.body.user_address;
  const user_phone = req.body.user_phone;
  const user_password = req.body.password;
  const role = req.body.role;
  const foundUser = await User.findOne({ where: { user_email: user_email } });
  if (foundUser !== null)
    return res.json({ messenger: "Tài khoản đã tồn tại " });

  await User.create({
    user_name: user_name,
    user_email: user_email,
    user_password: user_password,
    user_address: user_address,
    user_phone: user_phone,
    user_fullname: user_fullname,
    role: role,
  })
    .then((user) => {
      return res.status(201).json({ user });
    })
    .catch((err) => {
      next(err);
    });
};
const Login = async function (req, res) {
  const user_email = req.body.user_email;
  const user_password = req.body.password;
  const user = await User.findAll({
    where: { user_email: user_email, user_password: user_password },
    raw: true,
  });
  console.log(user);
  // console.log(tokenList)
  if (user.length <= 0) {
    return res.json({ result: "Sai tên đăng nhập hoặc mật khẩu " });
  }
  if (user.length <= 0 && user[0].password !== user_password) {
    return res.json({ result: "Sai tên đăng nhập hoặc mật khẩu" });
  }
  //encode Token
  const token = encodeToken(user[0].user_id, user[0].role);
  const refreshToken = encodeTokenfresh(user[0].user_id, user[0].role);
  // Lưu lại 2 mã access & Refresh token, với key chính là cái refreshToken để đảm bảo unique và không sợ hacker sửa đổi dữ liệu truyền lên.
  tokenList[refreshToken] = { token, refreshToken };
  if (user.length > 0) {
    res.setHeader("x-access-token", token);
    return res
      .status(200)
      .json({ result: true, token: token, refreshToken: refreshToken });
  }
};

const getAllUser = async (req, res, next) => {
  await User.findAll({ attributes: { exclude: ["user_password"] } })
    .then((users) => {
      res.json({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};
const editUser = async (req, res, next) => {
  const user_email = req.body.user_email;
  const user_fullname = req.body.fullname;
  const user_name = req.body.user_name;
  const user_address = req.body.user_address;
  const user_phone = req.body.user_phone;
  const user_password = req.body.password;
  await Users.update(
    {
      user_email,
      user_fullname,
      user_name,
      user_address,
      user_phone,
      user_password,
    },
    {
      returning: true,
      where: {
        user_id: req.params.id_User,
      },
    }
  )
    .then(([rowsUpdate, [updatedUser]]) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      next(err);
    });
};

const removeUser = async (req, res, next) => {
  const { id_user } = req.params;

  await Category.destroy({
    where: {
      user_id: id_user,
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

module.exports = {
  encodeToken,
  verifyToken,
  refreshtoken,
  newUser,
  Login,
  getAllUser,
  editUser,
  removeUser,
};
