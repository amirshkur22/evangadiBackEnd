import DbCon from "../db/DbConfig.js";
import { StatusCodes } from "http-status-codes";
const createTables = async (req, res) => {
  try {
    const usersTable = `CREATE TABLE IF NOT EXISTS users (
      user_id INT(20) AUTO_INCREMENT PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL UNIQUE,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(40) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL
    )`;

    const questionsTable = `CREATE TABLE IF NOT EXISTS questions (
      id INT(20) NOT NULL AUTO_INCREMENT,
      question_id VARCHAR(100) NOT NULL UNIQUE,
      user_id INT(20) NOT NULL,
      title VARCHAR(50) NOT NULL,
      asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      description TEXT NOT NULL,
      tag VARCHAR(20),
      PRIMARY KEY(id, question_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`;

    const answersTable = `CREATE TABLE IF NOT EXISTS answers (
      answer_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT(20) NOT NULL,
      question_id VARCHAR(100) NOT NULL,
      answer_text TEXT NOT NULL,
      posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_id) REFERENCES questions(question_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`;

    await DbCon.query(usersTable);
    await DbCon.query(questionsTable);
    await DbCon.query(answersTable);

    console.log("Tables Created Successfully!!");
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Tables Created Successfully!!" });
  } catch (error) {
    console.error(`Error while creating tables: ${error.message}`);
    res.status(500).send(`Error while creating tables: ${error.message}`);
  }
};

export { createTables };
//ALTER TABLE answers CHANGE COLUMN created_at posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
