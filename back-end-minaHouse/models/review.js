const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({

    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true, 'please provide rating']
    },
    comment:{
        type:String,
        required:[true, 'please provide comment'],
        maxlength:100
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
       },
    username:{
           type:String,
           required:true
       },
    product:{
        type:mongoose.Schema.ObjectId,
        ref: 'Product',
        required:true
    }   
},{timestamps:true})

reviewSchema.index({product:1, user:1}, {unique:true }) // each user can leave only one review per product

reviewSchema.statics.calcAvgRating = async function(productId){
    const result = await this.aggregate([
        {$match: {product:productId}},
        {$group:
        {
            _id:null,
            averageRating:{$avg:'$rating'},
            numOfReviews:{$sum:1}
        }}
    ]);
    console.log(result);
    try {
        await this.model('Product').findOneAndUpdate(
            {_id:productId},
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0
            })
    } catch (error) {
        console.log(error);
    }
    
}
reviewSchema.post('save', async function(){
    await this.constructor.calcAvgRating(this.product)
})


module.exports = mongoose.model('Review', reviewSchema)