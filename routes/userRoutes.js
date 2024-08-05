const express = require('express')
const { register, verifyEmail, ForgetPassword, resetPassword, signin } = require('../controller/userController')
const { userCheck, ValidationMethod } = require('../utils/validationfile')
const router = express.Router()

router.post('/register',userCheck, ValidationMethod, register)
router.get('/verifyEmail/:token',verifyEmail)
router.post('/forgetpassword',ForgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.post('/signin',signin)

module.exports = router