const customError = require('../errors')

const checkPermission = (reqUser,resourceUserid)=>{

 if(reqUser.role === 'admin') return
 if(reqUser.userId == resourceUserid) return

 throw new customError.UnauthorizedError('unathorized to access this route')
}


module.exports = checkPermission