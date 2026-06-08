import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,


  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  Sheets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sheet",
    }
  ],
  questionsAdded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    }
  ],
  questionsSolved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    }
  ],



}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;



