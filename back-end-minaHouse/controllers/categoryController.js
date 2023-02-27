const  Category  = require('../models/category');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const mongoose = require('mongoose')
exports.getAllCategories = async (req, res) => {

    const categoryList = await Category.find();

    if (!categoryList) {
        throw new BadRequestError('No Categories Found')
    }
    res.status(StatusCodes.OK).json(categoryList);
}

exports.getCategory = async (req, res) => {
    
    const isVlaidId = mongoose.isValidObjectId(req.params.id)
    if (!isVlaidId) {
        throw new BadRequestError('Invalid Id')
    }
    const category = await Category.findById({ _id: req.params.id });

    if (!category) {
        throw new BadRequestError(`There is no category with that id :${req.params.id}`)
    }
    res.status(StatusCodes.OK).send(category);
}

exports.addCategory = async (req, res) => {

    let category = new Category({
        name: req.body.name,
        image:  req.body.image,
        color: req.body.color,
    })

    category = await category.save();
    if (!category) {
        throw new BadRequestError('category can not be created')
    }
    res.status(StatusCodes.OK).json(category)
}
 exports.deleteCategory = async (req, res) => {
    const isVlaidId = mongoose.isValidObjectId(req.params.id)
    if (!isVlaidId) {
        throw new BadRequestError('Invalid Id')
    }
        const category = await Category.findOne({ _id: req.params.id });
        
        if (!category) {
            throw new BadRequestError('Inavlid Category')
        }
        await category.remove();
        res.status(StatusCodes.OK).json({ success: true, message: "category has been deleted" })
  
        
  

}
exports.updateCategory =  async (req, res) => {
    const isVlaidId = mongoose.isValidObjectId(req.params.id)

    if (!isVlaidId) {
        throw new BadRequestError('Invalid Id')
    }
        const category = await Category.findOneAndUpdate({ _id: req.params.id },{name:req.body.name, color:req.body.color, icon:req.body.icon}, { runValidators: true, new: true });
        if (!category) {
            throw new BadRequestError('Inavlid Category')
        }
        res.status(StatusCodes.OK).json({ success: true, category })
   
   

}

