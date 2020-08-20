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
router.route('/category/new').post(userController.newCategory)
router.route('/:id_category/remove').post(userController.removeCategory)
router.route('/:id_category/edit').put(userController.editCategory)

//!Unit
router.route('/unit/new').post(userController.newUnit)
router.route('/:id_unit/edit-unit').put(userController.editUnit)
router.route('/:id_unit/remove-unit').post(userController.removeUnit)

//!Product
router.route('/product').get(userController.getAllProduct)
router.route('/product/new').post(userController.newProduct)
router.route('/:id_product/edit-product').put(userController.editProduct)
router.route('/:id_product/remove-product').delete(userController.removeProduct)


//!Oder
router.route('/oders').get(userController.getAllODer)
router.route('/oder/new').post(userController.newOder)
router.route('/oder/:id').get(userController.getDetailOder)
router.route('/oder-edit/:id').put(userController.editODer)
router.route('/remove-oder/:id').delete(userController.deleteOder)








module.exports = router
