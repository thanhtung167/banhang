const express = require('express');
const router = require("express-promise-router")()
const userController = require('../Controller/user')
const Check = require('../middleware/checkToken');
const CheckRole = require('../middleware/checkRole');
const Checkrole = require('../middleware/checkRole');

router.post('/singup',userController.newUser)
router.route('/singin').post(userController.Login)
router.route('/refresh').post(userController.refreshtoken)
router.use('/',Check)

//!Users
router.route('/users').get(Checkrole,userController.getAllUser)
router.route('/users/edit/:id_user').put(userController.editUser)
router.route('/users/remove/:id_user').delete(Checkrole,userController.removeUser)

//!Category
router.route('/categorys').get(CheckRole,userController.getAllCate)
router.route('/categorys/new').post(CheckRole,userController.newCategory)
router.route('/categorys/remove/:id_category').delete(CheckRole,userController.removeCategory)
router.route('/categorys/edit/:id_category').put(CheckRole,userController.editCategory)

//!Unit
router.route('/units').get(CheckRole,userController.getAllUnit)
router.route('/units/new').post(CheckRole,userController.newUnit)
router.route('/units/edit/:id_unit').put(CheckRole,userController.editUnit)
router.route('/units/remove/:id_unit').delete(CheckRole,userController.removeUnit)

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
