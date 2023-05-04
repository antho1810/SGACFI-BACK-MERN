import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    cargo: {
      type: String,
      required: true,
    },
    rol: [{
      ref: "Role",
      type: Schema.Types.ObjectId,
    }],
    cedula: {
      type: String,
      unique: true,
      required: true,
    },
    telefono: {
      type: String,
      unique: true,
      required: true,
    },
    direccion: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKEy: false,
    timestamps: true,
  }
);

UserSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}
 
UserSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
 }

export default model("User", UserSchema);
