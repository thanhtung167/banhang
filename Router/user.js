const express = require('express');
const router = require("express-promise-router")()
const userController = require('../Controller/user')
// const checkLogin = require("../middleware/checkLogin");
// const checkLogout = require("../middleware/checkLogout");
// const check = require("../middleware/checkToken");
const Check = require('../middleware/checkToken');


router.post('/singup',userController.newUser)
router.route('/singin').post(userController.Login)
router.route('/refresh-token').post(userController.refreshtoken)
router.use('/',Check)
//!Category
router.route('/categorys/new').post(userController.newCategory)
router.route('/categorys/remove/:id_category').post(userController.removeCategory)
router.route('/categorys/edit/:id_category').put(userController.editCategory)

//!Unit
router.route('/units/new').post(userController.newUnit)
router.route('/units/edit/:id_unit').put(userController.editUnit)
router.route('/units/remove/:id_unit').post(userController.removeUnit)

//!Product
router.route('/products').get(userController.getAllProduct)
router.route('/products/new').post(userController.newProduct)
router.route('/products/edit/:id_product').put(userController.editProduct)
router.route('/products/remove/:id_product').delete(userController.removeProduct)


//!Oder
router.route('/oders').get(userController.getAllODer)
router.route('/oders/new').post(userController.newOder)
router.route('/oders/:id').get(userController.getDetailOder)
router.route('/oders/edit/:id').put(userController.editODer)
router.route('/oders/remove/:id').delete(userController.deleteOder)








module.exports = router
