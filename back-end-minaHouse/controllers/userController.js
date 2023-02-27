const User = require('../models/user')
const { StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {createJWT}= require('../utils')
const checkPermission = require('../utils/checkPermissions')

const getAllUsers = async (req, res) => {
    // console.log(req.user);
    const users = await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
}
const getSingelUser = async (req, res) => {
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if(!user) {
        
        throw new CustomError.NotFoundError('No User found with id ' + req.params.id)
    }
    console.log(user);
     checkPermission(req.user,user._id.toString())
    
    res.status(StatusCodes.OK).json({user})
    
}
const showCurrenteUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}

const updateUser = async (req, res) => {
    // console.log(req.user);
    const {name, email, address ,phone} = req.body
    if(!email || !name || !phone || !address ) {
        throw new CustomError.BadRequestError('please provide all data')
    }
 
    const user = await User.findOneAndUpdate({_id : req.user.userId},{name, email, address ,phone}, {
        new: true,
        runValidators: true
    })
    const userToken ={name: user.name,userId: user._id, role: user.role}
    const tokenUser = createJWT({payload: userToken});
   
    res.status(StatusCodes.OK).json({user: tokenUser})
}
const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    // console.log(req.user);
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError('please provide password')
    }
    const user = await User.findOne({_id : req.user.userId})

    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('invalid password')
    }

    user.password = newPassword
    await user.save()

    res.status(StatusCodes.OK).json({msg: "success! user password updated"})
}

module.exports ={
    getAllUsers,
    getSingelUser,
    showCurrenteUser,
    updateUser,
    updateUserPassword
}