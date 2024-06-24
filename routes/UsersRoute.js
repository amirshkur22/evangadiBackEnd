import { Router } from "express";
import { register, login, checkUser } from "../controller/userController.js";
import auth from "../middleware/Auth.js";
const router = Router();
//register route
router.post("/register", register);

//login user
router.post("/login", login);

//check user
router.get("/check", auth, checkUser);

export default router;
