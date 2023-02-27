const Product = require('../models/product');
const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors');
const Category = require('../models/category');

const mongoose = require('mongoose')
const createProduct = async (req, res) => {
    const { category } = req.body;

    const cat = await Category.findById(category);

    if (!cat) {
        throw new CustomApiError.BadRequestError('Invalid Category');
    }

    const product = await Product.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ product });
}

const getAllProducts = async (req, res) => {

    const { featured, name, sort, fields, numericalFilter, category } = req.query
    const queryObject = {}
    //search
    if (featured) {
        queryObject.featured = featured
    }

    // if (name) {
    //     queryObject.name = { $regex: name, $options: 'i' }
    // }

    //numericalFilter
    if (numericalFilter) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericalFilter.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'averageRating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
        });
    }
    if (category) {
        queryObject.category = category;
    }
    let result = Product.find(queryObject)
    //sort
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }
    //select
    if (fields) {
        const fieldList = sort.split(',').join(' ');
        result = result.select(fieldList);
    }
    //limit && skip 
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit
    result = result.skip(skip).limit(limit);

    const products = await result.populate('category')

    let numOfPages = Math.trunc(products.length / 10);
    numOfPages = numOfPages || 1;

    res.status(StatusCodes.OK).json({ products, numOfPages })
}

const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId }).populate('category');
    if (!product) {
        throw new CustomApiError.NotFoundError('No such product with id ' + productId);
    }
    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req,res)=>{
    const isVlaidId = mongoose.isValidObjectId(req.params.id)
    if (!isVlaidId) {
        throw new CustomApiError.BadRequestError('Invalid Id')
    }
        const product = await Product.findOne({ _id: req.params.id });
        
        if (!product) {
            throw new CustomApiError.BadRequestError('Inavlid product')
        }
        await product.remove();
        res.status(StatusCodes.OK).json({ success: true, message: "product has been deleted" })
}
const updateProduct = async (req,res)=>{
    const isVlaidId = mongoose.isValidObjectId(req.params.id)
    if (!isVlaidId) {
        throw new CustomApiError.BadRequestError('Invalid Id')
    }
        const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {new:true, runValidators:true});
        
        if (!product) {
            throw new CustomApiError.BadRequestError('Inavlid product')
        }
     
        res.status(StatusCodes.OK).json({ success: true, product })
}


module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
}

