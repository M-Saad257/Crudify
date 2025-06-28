import mongoose from "mongoose";

const crudSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, 
    default: "" 
  }
});

export const CRUD = mongoose.models.CRUD || mongoose.model("CRUD", crudSchema);
