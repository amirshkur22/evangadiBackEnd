import express from "express";
import cors from "cors";
import usersRoutes from "./routes/UsersRoute.js";
import questionsRoutes from "./routes/QuestionsRoute.js";
import answersRoutes from "./routes/AnswersRoute.js";
import tableRoutes from "./routes/TablesRoute.js";
import dbCon from "./db/DbConfig.js";
import auth from "./middleware/Auth.js";

const app = express();
const portNo = process.env.VITE_PORT_NO;
const railwayPort = process.env.RAILWAY_DB_PORT;
const railwayHostname = process.env.RAILWAY_DB_HOST;
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(cors());

// User routes middleware
app.use("/users", usersRoutes);
// Questions routes middleware
app.use("/questions", auth, questionsRoutes);
// Answers routes middleware
app.use("/answers", auth, answersRoutes);
// Table creation routes middleware
app.use("/tables", tableRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const start = async () => {
  try {
    await dbCon.execute('select "test"');
    // app.listen(portNo, () => {
    //   // console.log(`Server running and listening on http://localhost:${portNo}`);
    // });
    app.listen(railwayPort, () => {
      console.log(
        `Server running and listening on http://${railwayHostname}:${railwayPort}`
      );
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
