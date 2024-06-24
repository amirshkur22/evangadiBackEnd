import { StatusCodes } from "http-status-codes";
import DbConfig from "../db/DbConfig.js";
import { v4 } from "uuid";
const getQuestionsList = async (req, res) => {
    try {
        const query = `
            SELECT questions.question_id, questions.title, questions.description, users.user_name
            FROM questions
            JOIN users ON users.user_id = questions.user_id ORDER BY questions.id DESC
        `;
        const [result] = await DbConfig.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Error fetching questions" });
    }
};
const askQuestion = async (req, res) => {
  const { user_id, title, description } = req.body;
  if (!user_id || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide user_id, title, and description" });
  }
  const question_id = v4();
  try {
    //logic to save question in database
    const query = `
        INSERT INTO questions (question_id, user_id, title, description)
        VALUES (?, ?, ?, ?)
      `;
    await DbConfig.query(query, [question_id, user_id, title, description]);
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question asked successfully", question_id });
  } catch (error) {
    console.error(`Error while asking question: ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error while asking question" });
  }
};


export { getQuestionsList, askQuestion};
