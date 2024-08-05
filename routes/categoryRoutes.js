const express = require('express')
const { addCategory, getallcategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/CategoryController')
const { requireAdmin } = require('../controller/userController')
const { categoryCheck, ValidationMethod } = require('../utils/validationfile')
const router = express.Router()

// const router = require('express').Router()

router.post('/addcategory',requireAdmin,categoryCheck,ValidationMethod,addCategory)
router.get('/getallcategories',getallcategories)
router.get('/getcategorydetails/:id',getCategoryDetails)
router.put('/updatecategory/:id',requireAdmin,updateCategory)
router.delete('/deletecategory/:id',requireAdmin,deleteCategory)

module.exports = router