import { Schema, model } from "mongoose";
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
    rol: [],
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

export default model("User", UserSchema);
