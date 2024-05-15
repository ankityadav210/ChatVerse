import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    /// file will be uploaded successfully
    // console.log("File is successfully uploaded on cloudinary", response.url);
    // console.log(response);

    // file is success uploaded successfully then unlink the files
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // if the upload file is failed
    fs.unlinkSync(localFilePath); // remove the temp storage file
  }
};

export { uploadOnCloudinary };
