
const {isEmail} = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: { 
        type:String,
        required:[true, 'name must be provided'],
        maxlength:50,
        minlength:3
    },
    email: { 
        type:String,
        unique:true,
        required:[true, 'email must be provided'],
        validate: {
            validator: function(val){
                return isEmail(val)
            },
            message: 'please provide a valid email'
        }
    },
    password: { 
        type:String,
        required:[true, 'password must be provided'],
        minlength:4
    },
    address:{
        street: { 
            type:String,
            required:[true, 'street must be provided']
        },
        city: { 
            type:String,
            required:[true, 'city must be provided']
        }},
    phone: { 
        type:String,
        required:[true, 'phone number must be provided'],
        minlength:11
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    passwordToken: {
        type: String,
      },
      passwordTokenExpirationDate: {
        type: Date,
      },
})


UserSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch =await bcrypt.compare(candidatePassword,this.password)
    return isMatch;
}

module.exports = mongoose.model('User',UserSchema)