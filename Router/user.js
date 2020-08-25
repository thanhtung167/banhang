const express = require('express');
const router = require("express-promise-router")()
const userController = require('../Controller/user')
const productController = require('../Controller/product')
const unitController = require('../Controller/unit')
const categoryController = require('../Controller/category')
const oderController = require('../Controller/oder')
const inventoryController = require('../Controller/inventory')
const BranchController = require('../Controller/branch')
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
router.route('/categorys').get(CheckRole,categoryController.getAllCate)
router.route('/categorys/new').post(CheckRole,categoryController.newCategory)
router.route('/categorys/remove/:id_category').delete(CheckRole,categoryController.removeCategory)
router.route('/categorys/edit/:id_category').put(CheckRole,categoryController.editCategory)

//!Unit
router.route('/units').get(CheckRole,unitController.getAllUnit)
router.route('/units/new').post(CheckRole,unitController.newUnit)
router.route('/units/edit/:id_unit').put(CheckRole,unitController.editUnit)
router.route('/units/remove/:id_unit').delete(CheckRole,unitController.removeUnit)

//!Product
router.route('/products').get(productController.getAllProduct)
router.route('/products/new').post(productController.newProduct)
router.route('/products/edit/:id_product').put(productController.editProduct)
router.route('/products/remove/:id_product').delete(productController.removeProduct)


//!Oder
router.route('/oders').get(oderController.getAllODer)
router.route('/oders/new').post(oderController.newOder)
router.route('/oders/:id').get(oderController.getDetailOder)
router.route('/oders/edit/:id').put(oderController.editODer)
router.route('/oders/remove/:id').delete(oderController.deleteOder)
router.route('/oder/find').get(oderController.findOder)

//!Inventory
router.route('/inventory/new').post(inventoryController.newProduct)
router.route('/inventory/edit').put(inventoryController.editInventory)
router.route('/inventory/remove').delete(inventoryController.deleteInventory)


//!Branch
router.route('/branch').get(BranchController.getallBranch)
router.route('/branch/new').post(BranchController.newBranch)
router.route('/branch/edit/:BranchId').put(BranchController.editbranch)
router.route('/branch/remove/:BranchId').delete(BranchController.deleteBranch)



module.exports = router
