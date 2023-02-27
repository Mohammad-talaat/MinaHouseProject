const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
  //console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };

    

    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
