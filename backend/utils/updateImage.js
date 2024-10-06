import sharp from "sharp";
import DataURIParser from "datauri/parser.js";
import path from "path";

let modifiedImageBuffer = async (file) => {
  let modified = await sharp(file.buffer)
    .resize({ width: 400, height: 400, fit: "inside" })
    .toFormat("jpeg", { quality: 80 })
    .toBuffer();

  let parser = new DataURIParser();
  let extname = path.extname(file.originalname);

  let datauri = parser.format(extname, modified).content
  return datauri
};

export default modifiedImageBuffer;
