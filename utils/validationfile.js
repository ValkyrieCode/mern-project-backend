const  {check, validationResult} = require('express-validator')

exports.categoryCheck = [
    check('category_name',"Category is required").notEmpty()
    .isLength({min:3}).withMessage("Category must be at least 3 characters")
    .matches(/[a-zA-Z]+$/).withMessage("Category must only be letters")
]

exports.productCheck = [
    check('title','Product title is required').notEmpty() //for update => optional()
    .matches(/^[a-zA-Z0-9 \-]+$/).withMessage("Product title can only be alphabets, or numbers or - ")
    .isLength({min:3 }).withMessage("product title must be at least 3 characters"),
    check('price','Price is required').notEmpty()
    .isNumeric().withMessage("Price must be a number"),
    check('description','Description is required').notEmpty()
    .isLength({min:20}).withMessage("Description must be at least 20 characters"),
    check('stock','Stock id required').notEmpty()
    .isNumeric().withMessage('Stock must be a number'),
    check('category','Category is required').notEmpty()
]

exports.userCheck = [
    check('username','Username id required').notEmpty()
    .isLength({min:3}).withMessage("Username must be atleast 3 characterss")
    .not().isIn(['admin','god','dog','test']).withMessage("Username blocked"),
    check('email','email is required').notEmpty()
    .isEmail().withMessage("Email format incorrect"),
    check('password','Password is required').notEmpty()
    .matches(/[a-z]/).withMessage('Password must contain atleast 1 lowercase alphabet')
    .matches(/[A-Z]/).withMessage('Password must contain atleast 1 uppercase alphabet')
    .matches(/[0-9]/).withMessage('Password must contain atleast 1 number')
    .matches(/[!@#$%]/).withMessage('Password must contain atleast 1 special alphabet')
    .isLength({min:8}).withMessage('Passmust must be atleast 8 characters')
    .isLength({max:30}).withMessage('Password must not exceed 30 characters')
]

exports.ValidationMethod = (req,res,next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }else{
        return res.status(400).json({error:errors.array()[0].msg})
    }
}