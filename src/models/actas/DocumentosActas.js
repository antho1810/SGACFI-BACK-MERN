import { Schema, model } from "mongoose";

const DocumentosActaShema = new Schema(
  {
    filename: String,
    filetype: String,
    filedata: Buffer,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Dcoumentos", DocumentosActaShema);
