const mongoose = require('mongoose')
const OrderItems = require('./OrderItems')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    OrderItems:[{
        type: ObjectId,
        ref: "OrderItems"

    }],
    user:{
        type: ObjectId,
        ref: "User",
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    order_status:{
        type: String,
        default: "Pending"
    },
    street:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("Order",orderSchema)