let express = require('express')
require('dotenv').config()
require('./database/connection')
let cors = require('cors')

//routes
const CategoryRoute = require('./routes/categoryRoutes')
const ProductRoute = require('./routes/productRoutes')
const UserRoute = require('./routes/userRoutes')
const OrderRoute = require('./routes/orderRoute')


let app = express()
let port = process.env.PORT

// middleware
app.use(express.json())
app.use(cors())

// using routes
app.use(CategoryRoute)
app.use(ProductRoute)
app.use(UserRoute)
app.use(OrderRoute)


app.listen(port,()=>{
    console.log(`APP STARTED SUCCESSFULLY at port: ${port}`)})