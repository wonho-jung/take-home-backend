require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

app.get("/users", (req, res) => {
  const getUsers = "SELECT * FROM user";
  db.query(getUsers, (err, result) => {
    if (err) return res.status(500).json({ message: "Please try again later" });
    else {
      return res.status(200).json({ result });
    }
  });
});

app.post("/user/register", (req, res) => {
  const userName = req.body.userName;
  const insertDB = "INSERT INTO user (user_name) VALUES (?)";
  const userExists = "SELECT user_name FROM user WHERE user_name = ?";

  db.query(userExists, [userName], (err, result) => {
    if (err) return res.status(500).json({ message: "Please try again later" });
    if (result.length > 0) {
      res.status(400).json({
        message: "User already exists",
      });
    } else {
      db.query(insertDB, [userName], (err, result) => {
        if (err) return res.status(500);
        else {
          return res.status(200).json({
            userID: result.insertId,
            userName: userName,
            size: null,
          });
        }
      });
    }
  });
});

app.post("/user/login", (req, res) => {
  const userName = req.body.userName;
  const userExists = "SELECT * FROM user WHERE user_name = ?";

  db.query(userExists, [userName], (err, result) => {
    if (err) return res.status(500).json({ message: "Please try again later" });
    if (result.length > 0) {
      res.status(200).json({
        userName: userName,
        userID: result[0].id,
        size: result[0].size,
      });
    } else {
      res.status(400).json({
        message: "User does not exist",
      });
    }
  });
});

app.put("/user/:id", (req, res) => {
  const userID = req.params.id;
  const userSize = req.body.size;
  const userSizeUpdate = "UPDATE user SET size = ? WHERE id = ?";
  db.query(userSizeUpdate, [userSize, userID], (err, result) => {
    if (err) return res.status(500).json({ message: "Please try again later" });
    else {
      return res.status(200).json({ message: "Size updated!" });
    }
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
