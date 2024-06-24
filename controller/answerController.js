import { StatusCodes } from "http-status-codes";
import DbConfig from "../db/DbConfig.js";

// Function to post an answer
const postAnswer = async (req, res) => {
  const { user_id, question_id, answer } = req.body;

  if (!user_id || !question_id || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide user_id, question_id, and answer" });
  }

  try {
    const query = `
      INSERT INTO answers (question_id, user_id, answer_text)
      VALUES (?, ?, ?)
    `;
    await DbConfig.query(query, [question_id, user_id, answer]);
    res.status(StatusCodes.CREATED).json({
      msg: `Answer posted successfully for question id ${question_id}`,
      answer,
    });
  } catch (error) {
    console.error(`Error while posting answer: ${error.message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error while posting answer" });
  }
};

// Function to get question details and answers
const getQuestionDetailsAndAnswers = async (req, res) => {
  const { question_id } = req.params;
// console.log(req)
  if (!question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Question ID is required" });
  }

  try {
    const query = `
      SELECT 
      q.title, 
      q.description, 
      a.answer_text, 
      u.user_name AS answeredBy, 
      u2.user_name AS askedBy, 
      a.posted_at
  FROM 
      questions q
  LEFT JOIN 
      answers a ON q.question_id = a.question_id
  LEFT JOIN 
      users u ON a.user_id = u.user_id
  LEFT JOIN 
      users u2 ON q.user_id = u2.user_id
  WHERE 
      q.question_id = ?
      
      `;

    const [results] = await DbConfig.query(query, [question_id]);
// console.log(results)
    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found for this question" });
    }

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error(
      `Error fetching question details and answers: ${error.message}`
    );
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error fetching question details and answers" });
  }
};
export { postAnswer, getQuestionDetailsAndAnswers };
