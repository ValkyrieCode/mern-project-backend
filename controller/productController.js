const Product = require('../models/productModel')

// add product
exports.addProduct = async (req, res)=>{
    let product = await Product.create({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock,
        category: req.body.category
    })
    if(!product){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(product)
}

exports.getAllProducts = async(req,res)=>{
    let products = await Product.find().populate('category','category_name')
    if (!products){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(products)
}

// get product by category
exports.getProductsByCategory = async(req,res)=>{
    let products = await Product.find({
        category: req.params.categoryId
    })
    .populate('category','category_name')
    if (!products){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(products)
}