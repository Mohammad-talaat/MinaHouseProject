const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const imageUpload = async (req, res, next) => {
   
    console.log(req.files)
    if (!req.files.image) {
        throw new CustomApiError.BadRequestError("no file uploaded")
    }
    if (!req.files.image.mimetype.startsWith('image')) {
        throw new CustomApiError.BadRequestError("please upload image")
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: 'file-upload'
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    console.log(result)
    req.imagePath = result.secure_url;
    res.status(201).json({image:result.secure_url})
}

module.exports = imageUpload