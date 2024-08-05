const express = require('express')
const { addProduct, getAllProducts, getProductsByCategory } = require('../controller/productController')
const router = express.Router()

router.post('/addproduct',addProduct)
router.get('/getallproduct',getAllProducts)
router.get('/getproductbycategory/:categoryId',getProductsByCategory)

module.exports = router