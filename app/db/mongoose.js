import mongoose from "mongoose";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/app-db"

mongoose
  .connect(DB_URL, options)
  .then(() => console.log("mongodb: conncted"))
  .catch((err) => console.log("mongodb:", err))