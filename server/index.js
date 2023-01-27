const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;

let port = 8082;

//連結MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("成功連結mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", authRoute);

app.listen(port, () => {
  console.log("伺服器正在聆聽" + port + "...");
});
