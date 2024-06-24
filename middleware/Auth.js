import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const VITE_SECRETE_KEY = process.env.VITE_SECRETE_KEY;
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

//   console.log(authHeader);
  if (!authHeader||!authHeader.startsWith('Bearer')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "authentication invalid" });
    }
    const token = authHeader.split(' ')[1]
    // console.log(token)
  try {
      const payloadData = jwt.verify(token, VITE_SECRETE_KEY);
      const { user_id, user_name } = payloadData
      req.user = { user_id, user_name };
   next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};
export default auth;
