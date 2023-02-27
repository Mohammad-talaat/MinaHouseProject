require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
app.use(fileUpload({ useTempFiles: true }));

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

//express

app.use(morgan("tiny"));
app.use(express.json());
require("express-async-errors");
app.use(cors());

//rest of package

const port = process.env.PORT || 3000;
//database
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routers/authRouters");
const productRouter = require("./routers/productRouters");
const categoryRoutes = require("./routers/categoryRoutes");
const reviewRoutes = require("./routers/reviewRouters");
const orderRouter = require("./routers/orderRouters");
const userRoutes = require('./routers/userRouters');
const imageRouter =  require('./routers/imageRoutes')
//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const {
  authenticateUser,
  authorizePermissions,
} = require("./middleware/authentication");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/uploads',authenticateUser, authorizePermissions('admin', 'owner') ,imageRouter);
app.use(
  "/api/v1/orders",
  authenticateUser,
 
  orderRouter
);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
