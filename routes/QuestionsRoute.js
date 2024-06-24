import { Router } from "express";
import { askQuestion, getQuestionsList } from "../controller/questionsController.js";
import auth from "../middleware/Auth.js";
const router = Router();
router.get("/questionsList",auth ,getQuestionsList);
//ask question 
router.post("/askQuestion",auth ,askQuestion);


export default router;
