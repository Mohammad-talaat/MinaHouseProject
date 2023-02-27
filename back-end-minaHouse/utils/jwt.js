const jwt = require('jsonwebtoken')


const createJWT = ({payload}) =>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME} )
    return token;
}
const isTokenValid = ({token})=>{ const payload = jwt.verify(token, process.env.JWT_SECRET)
return payload }


module.exports ={ createJWT, isTokenValid}