import express from "express";
import { Authentication } from "../utils/authentication.js";
import {
  CommentonPost,
  GetAlltheComments,
} from "../controller/commentController.js";

let router = express.Router();
router.route("/createComment/:id").post(Authentication, CommentonPost);
router.route("/getallthecomments/:id").get(Authentication, GetAlltheComments);

export default router;
