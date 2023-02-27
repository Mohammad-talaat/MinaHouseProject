const mongoose = require('mongoose');
const Product = require('./product')
const categorySchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
image:{
    type:String,

},
color:{
    type:String,
},
})

categorySchema.pre('remove', async function (){
    console.log(this._id)
   await Product.deleteMany({category: this._id})

    
})
const Category =  mongoose.model('Category', categorySchema)
module.exports = Category;


