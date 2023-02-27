const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
    createJWT,
    resetPassEmail,
    createHash } = require('../utils')
const crypto = require('crypto');


const register = async (req, res) => {

    const { name, email, password, address, phone } = req.body
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin' : 'user'

    const user = await User.create({ name, email, password, address, phone, role })
    const userToken = { name: user.name, userId: user._id, role: user.role }
    const token = createJWT({ payload: userToken })

    res.status(StatusCodes.CREATED).json({ user: userToken, token })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError.BadRequestError('please provide a valid email or password ')
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError("Please provide a valid email or password")
    }
    const isPasswordVerified = await user.comparePassword(password)
    if (!isPasswordVerified) { 
        throw new CustomError.UnauthenticatedError("Invalid credentials")
    }
    const userToken = { name: user.name, userId: user._id, role: user.role }
    const token = createJWT({ payload: userToken })
    res.status(StatusCodes.OK).json({ user: userToken, token })

}


const logout = async (req, res) => {
// either we delete this line or create a token with the function createJWT(payload)
    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3000' })
    // res.status(StatusCodes.OK).json({ msg: "user logged out", token })
    res.status(StatusCodes.OK).json({ msg: "user logged out" })
}

const admin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Invalid Credentails')
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.BadRequestError('Invalid Credentails')
    }
    const isPasswordVerified = await user.comparePassword(password);
    if (!user || !isPasswordVerified) {
        throw new CustomError.BadRequestError('Invalid Credentails')
    }
    const roles = ['admin', 'owner'];
    if (!roles.includes(user.role)) {
        throw new CustomError.UnauthenticatedError("Unauthorized for this route")
    }

    const userToken = { name: user.name, userId: user._id, role: user.role }
    const token = createJWT({ payload: userToken })
    res.status(StatusCodes.OK).json({ user: userToken, token })

}

const addAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
        throw new CustomError.BadRequestError("This email already exist")
    }

    const user = await User.create(req.body)
    if (!user) {
        throw new CustomError.BadRequestError('Can not create it.')
    }
    res.status(StatusCodes.CREATED).json({ message: 'success', user });
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new CustomError.BadRequestError('Please provide a valid email')
    }
    const user = await User.findOne({ email })
    if (user) {
        const passwordToken = crypto.randomBytes(70).toString('hex')

        // send email
        await resetPassEmail({ name: user.name, email: user.email, token: passwordToken })
        // end of sending email code 

        const tenMinutes = 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
    }

    res.status(StatusCodes.OK).json({ msg: "Please check your email to reset your password" })
}

const resetPassword = async (req, res) => {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ email });

    if (user) {
        const currentDate = new Date();

        if (
            user.passwordToken === createHash(token) &&
            user.passwordTokenExpirationDate > currentDate
        ) {
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            await user.save();
        }
    }

    // res.send('reset password');
    res.status(StatusCodes.OK).json({ msg: "reset is done successfully" })
};

module.exports = {
    register,
    login,
    logout,
    admin,
    addAdmin,
    forgotPassword,
    resetPassword
};