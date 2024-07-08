import express from "express";
import dotenv from "dotenv";

// load .env file
dotenv.config();

// const for app
const app = express();

// route app
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// const for port
const port = process.env.PORT;
// listen app
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
