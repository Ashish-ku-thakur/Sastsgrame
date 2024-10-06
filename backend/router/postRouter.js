import express from "express";
import { AddNewPost, DeletethePost, DislikethePost, GetAllPosta, LikethePost } from "../controller/postController.js";
import { Authentication } from "../utils/authentication.js";
import upload from "../utils/multer.js";

let router = express.Router();
router
  .route("/addnewpost")
  .post(Authentication, upload.single("image"), AddNewPost);

router.route("/likepost/:id").patch(Authentication, LikethePost);
router.route("/dislikepost/:id").patch(Authentication, DislikethePost);
router.route("/deletepost/:id").delete(Authentication, DeletethePost);
router.route("/getallpost").get(Authentication, GetAllPosta);

export default router;
