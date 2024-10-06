import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// cloudinary.config({
//   cloud_name: "dgng15pu1",
//   api_key: "459315955593446",
//   api_secret: "QNL8fArjW9OKXZNFZl6pbT_e2qA",
// });
export default cloudinary;
