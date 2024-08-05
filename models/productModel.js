const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    image:{
        type: String
    },
    category:{
        type: ObjectId,
        ref: "Category"
    }, 
},{timestamps: true })

module.exports = mongoose.model('Product',productSchema)