const express = require('express')
const { placeOrder, getAllOrders } = require('../controller/orderController')
const router = express.Router()

router.post('/placeorder',placeOrder)
router.post('/getallorders',getAllOrders)
module.exports = router