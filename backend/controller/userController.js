import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import modifiedImageBuffer from "../utils/updateImage.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../model/postSchema.js";

export let Register = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    // check all fields are filled
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    // check email is already exist or not
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "this email is present try a new email",
        success: false,
      });
    }

    // create a new user

    // hash the password
    let hashPassword = await bcrypt.hash(password, 10);

    let newUser = await User.create({
      fullname,
      email,
      password: hashPassword,
    });

    await newUser.save();

    if (newUser) {
      return res.status(201).json({
        message: "new User Created",
        success: true,
        user: newUser,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export let Login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // check all fields are filled
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // check email is correct
    let checkEmail = await User.findOne({ email })
      .populate({ path: "posts" })
      .populate({ path: "bookmarks" });

    if (!checkEmail) {
      return res.status(400).json({
        message: "Email and Password is not authenticated",
        success: false,
      });
    }

    // check password is correct
    let checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Password and Email is not authenticated",
        success: false,
      });
    }

    // generate token
    let userOptions = {
      userId: checkEmail.id,
    };

    let token = await jwt.sign(userOptions, process.env.HASH_PASSWORD, {
      expiresIn: "24h",
    });

    return res
      .status(200)
      .cookie("uid", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true })
      .json({
        message: `welcome back ${checkEmail.fullname}`,
        success: true,
        user: checkEmail,
      });
  } catch (error) {
    console.log(error);
  }
};

export let Logout = async (req, res) => {
  try {
    return res.status(200).cookie("uid", "", { expiresIn: "0" }).json({
      message: "User SuccessFully logout",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetAllUsers = async (req, res) => {
  try {
    let userId = req.userId;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "please authenticat",
        success: false,
      });
    }

    let otherUsers = await User.find({ _id: { $ne: userId } })
      .populate({ path: "posts", select: "postImage likes comments" })
      .populate({ path: "bookmarks", select: "postImage likes comments" });
    return res.status(200).json({
      message: "get all users",
      success: true,
      users: otherUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export let FollowtheUser = async (req, res) => {
  try {
    let userId = req.userId; // authId
    let loveId = req.params.id;

    if (!userId || !loveId) {
      return res.status(400).json({
        message: "id is missing (userId or likeOne)",
        success: false,
      });
    }

    let user = await User.findById(userId);
    let love = await User.findById(loveId);

    if (!user.following.includes(loveId)) {
      await Promise.all([
        // User.findByIdAndUpdate(
        //   { _id: userId },
        //   { following: loveId },

        // ),
        // User.findByIdAndUpdate(
        //   { _id: loveId },
        //   { followers: userId },

        // ),

        user.following.push(loveId),
        user.save(),
        love.followers.push(userId),
        love.save(),
      ]);

      user = await User.findById(userId);

      return res.status(200).json({
        message: `${user.fullname} just followed ${love.fullname}`,
        success: true,
        user,
      });
    }
    user = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: `${user.fullname} just followed ${love.fullname}`,
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export let UnFollowtheUser = async (req, res) => {
  try {
    let userId = req.userId; // authId
    let loveId = req.params.id;

    if (!userId || !loveId) {
      return res.status(400).json({
        message: "id is missing (userId or likeOne)",
        success: false,
      });
    }

    let user = await User.findById(userId);
    let love = await User.findById(loveId);

    if (user.following.includes(loveId)) {
      await Promise.all([
        User.findByIdAndUpdate(
          { _id: userId },
          { $pull: { following: loveId } }
        ),
        User.findByIdAndUpdate(
          { _id: loveId },
          { $pull: { followers: userId } }
        ),
      ]);

      user = await User.findById(userId).select("-password");

      return res.status(200).json({
        message: `${user.fullname} just unFollowed ${love.fullname}`,
        success: true,
        user,
      });
    }

    user = await User.findById(userId);

    return res.status(200).json({
      message: `${user.fullname} just unfollowed ${love.fullname}`,
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetSelectedUserProfile = async (req, res) => {
  try {
    let selectedUserId = req.params.id; // sllected user id

    if (!selectedUserId) {
      return res.status(400).json({
        message: "selected user id is required",
        success: false,
      });
    }

    let selectedUser = await User.findById(selectedUserId)
      .select("fullname profilePhoto")
      .populate({ path: "posts" })
      .populate({ path: "bookmarks" });
    if (!selectedUser) {
      return res.status(400).json({
        message: "selected user is not defined",
        success: false,
      });
    }

    return res.status(200).json({
      selectedUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export let EditUserProfile = async (req, res) => {
  try {
    let userId = req.userId;
    let image = req.file;
    let gender = req.body.gender;
    let bio = req.body.bio;

    let user = await User.findById(userId);

    if (bio) {
      user.bio = bio;
      await user.save();
    }
    if (gender) {
      user.gender = gender;
      await user.save();
    }

    let cloudResponse;
    if (image) {
      let fileuri = await modifiedImageBuffer(image);
      cloudResponse = await cloudinary.uploader.upload(fileuri);

      user.profilePhoto = cloudResponse.secure_url;
      await user.save();
    }

    user = await User.findById(userId).select("-password");

    return res.status(202).json({
      message: "user profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export let BookmarkthePost = async (req, res) => {
  try {
    let userId = req.userId;
    let postId = req.params.id;

    if (!postId) {
      return res.status(400).json({
        message: "postId is required",
        success: false,
      });
    }

    let user = await User.findById(userId);
    let post = await Post.findById(postId).select("postImage likes comments");

    if (user.bookmarks.includes(postId)) {
      // pull
      await Promise.all([
        User.updateOne({ _id: userId }, { $pull: { bookmarks: postId } }),
        Post.updateOne({ _id: postId }, { $pull: { saved: userId } }),
      ]);
      let updateUser = await User.findById(userId).populate({
        path: "bookmarks",
      });

      return res.status(200).json({
        message: "post is Unbookmarked",
        success: true,
        post,
      });
    } else {
      // push

      await Promise.all([
        User.updateOne({ _id: userId }, { $push: { bookmarks: postId } }),
        Post.updateOne({ _id: postId }, { $push: { saved: userId } }),
      ]);

      let updateUser = await User.findById(userId).populate({
        path: "bookmarks",
      });

      return res.status(200).json({
        message: "post is bookmarked",
        success: true,
        post,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
