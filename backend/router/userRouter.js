import express from "express";
import {
  BookmarkthePost,
  EditUserProfile,
  FollowtheUser,
  GetAllUsers,
  GetSelectedUserProfile,
  Login,
  Logout,
  Register,
  UnFollowtheUser,
} from "../controller/userController.js";
import { Authentication } from "../utils/authentication.js";
import upload from "../utils/multer.js";

let router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/getallusers").get(Authentication, GetAllUsers);
router.route("/followtheuser/:id").patch(Authentication, FollowtheUser);
router.route("/unfollowtheuser/:id").patch(Authentication, UnFollowtheUser);
router.route("/selecteduser/:id").get(Authentication, GetSelectedUserProfile);
router
  .route("/edituserprofile")
  .patch(Authentication, upload.single("profileImage"), EditUserProfile);
router.route("/bookmark/:id").patch(Authentication, BookmarkthePost);

export default router;
