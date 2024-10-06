import jwt from "jsonwebtoken";
export let Authentication = async (req, res, next) => {
  try {
    let token = req.cookies.uid;

    if (!token) {
      return res.status(400).json({
        message: "token is missing",
        success: false,
      });
    }

    let isAuthenticated = await jwt.verify(token, process.env.HASH_PASSWORD);

    if (!isAuthenticated) {
      return res.status(400).json({
        message: "you are not authenticated",
        success: false,
      });
    }

    req.userId = isAuthenticated.userId
    next()
  } catch (error) {
    console.log(error);
  }
};
