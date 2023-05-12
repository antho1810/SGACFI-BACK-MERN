import { Schema, model } from "mongoose";

const DocumentosActaShema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    archivo: {type: Buffer, required:true},
    tipoArchivo: {type: String, required:true},
    fechaCreacion: {type: Date, default: Date.now},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Dcoumentos", DocumentosActaShema);
