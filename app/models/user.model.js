import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'please enter a valid email address'],
    required: [true, 'email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 6
  }
})

userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next;

  this.password = await bcrypt.hash(this.password, 10);

  next();
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', userSchema, 'users')