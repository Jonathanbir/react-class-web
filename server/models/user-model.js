const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 1024,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//instance methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result = await bcrypt.compare(password, this.password);
  return cb(null, result);
};

//mongoose middlewares
//若使用者為新用戶,或者是正在改密碼,則將密碼進行走湊處理
userSchema.pre("save", async function (next) {
  //this 代表 mongoDB 內的 document
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
