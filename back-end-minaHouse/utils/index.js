const {createJWT,isTokenValid} = require('./jwt')
const {resetPassEmail} = require('./sendResetPassEmail')
const createHash = require('./hashFunction');
const {sendEmail} = require('./sendEmail')

module.exports={
    createJWT,
    isTokenValid,
    resetPassEmail,
    createHash,
    sendEmail
}