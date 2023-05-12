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
      default: Date.now,
    },
    lugar: {
      type: String,
      required: true,
    },
    modalidad: {
      type: String,
      enum: ["presencial", "virtual", "mixta"],
      required: true,
    },
    estado: {
      type: String,
      enum: ["En proceso", "Aprovado"],
      default: "En proceso",
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
    miembrosPresentes: [
      {
        ref: "Participante",
        type: Schema.Types.ObjectId,
      },
    ],
    miembrosAusentes: [
      {
        ref: "Participante",
        type: Schema.Types.ObjectId,
      },
    ],
    miembrosInvitados: [
      {
        ref: "Participante",
        type: Schema.Types.ObjectId,
      },
    ],
    desarrolloActa: {
      type: [],
      required: true,
    },
    articulos:
      {
        type: [],
        required: true,
      },
    docsSoporte: [{
      ref: "Documentos",
      type: Schema.Types.ObjectId,
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Acta", ActaSchema);
