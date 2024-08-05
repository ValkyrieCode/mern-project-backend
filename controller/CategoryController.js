const { request, response } = require('express')
const Category = require('../models/CategoryModel')

exports.addCategory = async(request,response)=>{
    let category = await Category.findOne({
        category_name:request.body.category_name
    })
    if(category){
        return response.status(400).json({error:"Category already exists"})
    }

    let newCategory = await Category.create({
        category_name: request.body.category_name
    })
    if(!newCategory){
        return response.status(400).json({error:"Something went wrong"})
    }
    response.send(newCategory)
}
exports.getallcategories = async(request,response)=>{
    let categories = await Category.find()
    if (!categories){
        return response.status(400).json({error:"Something went wrong"})
    }
    response.send(categories)
}

exports.getCategoryDetails = async(request,response)=>{
    let category = await Category.findById(request.params.id)
    if (!category){
        return response.status(400).json({error:"Something went wrong"})
    }
    response.send(category)
}

exports.updateCategory = async(request,response)=>{

    try{
    let category = await Category.findByIdAndUpdate(request.params.id,{
        category_name: request.body.category_name
    },{new:true})
    if (!category){
        return response.status(400).json({error:"Something went wrong"})
    }
    response.send(category)
}
catch(error){
    return response.status(400).json({error:ErrorEvent.message})
}
}

exports.deleteCategory = async(request,response)=>{
    Category.findByIdAndDelete(request.params.id)
    .then((category)=>{
        if(!category){
            return response.status(400).json({error: "Category not found"})
        }
        response.send({message: "Category deleted Successfully"})
    })
    .catch(error=>{
        return response.status(400).json({error:"Sosmething went wrong"})
    })
}
/*
request.body => data is sent using body of form
params => data is sent using url

let newCategory = new Category({
category_name : request.body.category_name})
await newCategory.save()

response.send(obj) -> status code: 200, OK
response.json({key:value}) -> status code: 200 OK

response.status(400).json({ })-> status code: 400,bad request
                                        404- authetication
                                        403- unauthorized
                                        500- server error*/
