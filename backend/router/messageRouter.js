import express from "express";
import { Authentication } from "../utils/authentication.js";
import { GetAllMessages, MessageCreate } from "../controller/messageController.js";

let router = express.Router();

router.route("/messagecreate/:id").post(Authentication, MessageCreate);
router.route("/getallmessage/:id").get(Authentication, GetAllMessages);
export default router;
