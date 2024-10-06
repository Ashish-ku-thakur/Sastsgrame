import { populate } from "dotenv";
import Conversation from "../model/conversationSchema.js";
import Message from "../model/messageSchema.js";
import { getSocketId, io } from "../socket/socket.js";

export let MessageCreate = async (req, res) => {
  try {
    let senderId = req.userId;
    let receiverId = req.params.id;
    let text = req.body.text;

    if (!receiverId || !text) {
      return res.status(400).json({
        message: "receiverId or text is not defined",
        success: false,
      });
    }

    let conversation = await Conversation.findOne({
      group: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        group: [senderId, receiverId],
      });

      await conversation.save();
    }

    let newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    if (newMessage) {
      //conversation me bhejna hai
      conversation = await Conversation.findById({ _id: conversation?._id });
      conversation.messages.push(newMessage?._id);
      await conversation.save();
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // soclet io implementaion
    let receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMassage", newMessage);
    }

    return res.status(201).json({
      message: "new Message created",
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetAllMessages = async (req, res) => {
  try {
    let senderId = req.userId;
    let receiverId = req.params.id;

    if (!receiverId || !senderId) {
      return res.status(400).json({
        message: "senderId or receiverId id not defined",
        success: false,
      });
    }

    let conversation = await Conversation.findOne({
      group: { $all: [senderId, receiverId] },
    })
      .populate({
        path: "messages",
      })
      .select("messages -_id");

    if (!conversation) {
      return res.status(400).json({
        message: "converstaion is not defined",
        success: false,
      });
    }

    return res.status(200).json({
      message: "all messages",
      success: true,
      conversation,
    });
  } catch (error) {
    console.log(error);
  }
};
