const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);

let port = 8089;

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
//course route 應該被jwt保護
//如果request header內部沒有jwt,則request就會被視為是unauthorized
app.use(
  "/api/coursers",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(port, () => {
  console.log("伺服器正在聆聽" + port + "...");
});
