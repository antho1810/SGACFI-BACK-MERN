import { Schema, model } from "mongoose";

const ActaSchema = new Schema(
  {
    numeroRef: {
      type: Number,
      required: true,
      unique: true,
    },
    fechaCreacion: {
      type: Date,
      required: true,
    },
    lugar: {
      type: String,
      required: true,
    },
    modalidad: {
      type: String,
      required: true,
    },
    horaInicia: {
      type: String,
      required: true,
    },
    horaFinal: {
      type: String,
      required: true,
    },
    // miembrosPresentes: [],
    // miembrosAusentes: [],
    // miembrosInvitados: [],
    // desarrolloActa: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
    // votos: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
    // docsSoporte: [],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Acta", ActaSchema);
