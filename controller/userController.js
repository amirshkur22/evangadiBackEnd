import dbCon from "../db/DbConfig.js";
// import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const VITE_ENCRIPT_DECRIPT_KEY = process.env.VITE_ENCRIPT_DECRIPT_KEY;
const VITE_SECRETE_KEY = process.env.VITE_SECRETE_KEY;
const register = async (req, res) => {
  const { userName, firstName, lastName, email, password } = req.body;
  console.log(userName, firstName, lastName, email, password);
  if (!userName || !firstName || !lastName || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "please provide all required information!!" });
  }
  try {
    const [user] = await dbCon.query(
      `SELECT user_id,user_name FROM users WHERE user_name=? OR email=?`,
      [userName, email]
    );
    console.log(user);
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "user already exist!!" });
    }
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "password  must be at least 8 charcters" });
    }
    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      VITE_ENCRIPT_DECRIPT_KEY
    ).toString();
    await dbCon.query(
      `INSERT INTO users(user_name,first_name,last_name,email,password )VALUES(?,?,?,?,?)`,
      [userName, firstName, lastName, email, encryptedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "user registered sucessfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message}` });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "please provide all required information " });
  }
  try {
    const [user] = await dbCon.query(
      `SELECT user_id, user_name, password FROM users WHERE email=?`,
      [email]
    );
    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "invalid credential" });
    }
    // Decrypt the password we get from database
    const bytes = CryptoJS.AES.decrypt(
      user[0].password,
      VITE_ENCRIPT_DECRIPT_KEY
    );
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (password !== decryptedPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "password does not  match" });
    }
    const { user_name, user_id } = user[0];
    const token = jwt.sign({ user_name, user_id }, VITE_SECRETE_KEY, {
      expiresIn: "1y",
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "user loged In sucessfully!!", token, user_name });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `${error.message}` });
  }
};

const checkUser = async (req, res) => {
  const { user_id, user_name } = req.user;
  res
    .status(StatusCodes.OK)
    .json({ message: "valid user", user_id, user_name });
};
export { register, login, checkUser };
