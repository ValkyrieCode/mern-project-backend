const Order = require('../models/Order')
const OrderItems = require('../models/OrderItems')

// place order
exports.placeOrder = async (req, res) => {
    let order_items_ids = await Promise.all(
        req.body.orderItems.map(async orderItem=>{
            let ORDERITEM = await OrderItems.create({
                product:orderItem.product,
                quantity: orderItem.quantity
            })
            if(!ORDERITEM){
                return res.status(400).json({error:"failed to place order"})
            }
            return ORDERITEM._id
        })
    )
    let individual_total = await Promise.all(order_items_ids.map(async OrderItemId=>{
        let ORDERITEM = await OrderItems.findById(OrderItemId).populate('product','price')
        return ORDERITEM.product.price * ORDERITEM.quantity
    })
)

    let total = individual_total.reduce((a,c)=>a+c)

    let order = await Order.create({
        orderItems: order_items_ids,
        user: req.body.user,
        total: total,
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        phone: req.body.phone
    })

    if(!order){
        return res.status(400).json({error:"Failed to place order."})
    }
    res.send(order)
}

// get all orders
 exports.getAllOrders = async(req, res) => {
    let orders = await Order.find().
    populate({path: 'orderItems', populate:{path: 'product', populate: 'category'}
    })
    if(!orders){
        return res.status(400).json({error: "Something went worng"})
    }
    res.send(orders)
 }

 // delete order
 exports.deleteOrder = (req, res) =>{
    Order.findByIdAndDelete(req.params.id)
    .then(deletedOrder => {
        if(!deletedOrder){
            return res.status(400).json({error: "Order not found"})
        }
        deletedOrder.orderItems.map(item =>{
            OrderItems.findByIdAndDelete(item)
            .then(deletedItem=>{
                if(!deletedItem){
                    return res.status(400).json({error: "Something went wrong"})
                }
            })
        })
    })
    res.send({message: "Order deleted Successfully"})
 }