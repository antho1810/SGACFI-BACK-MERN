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
      ref: "Modalidad",
      type: Schema.Types.ObjectId
    },
    estado: {
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
    desarrolloActa: [
      {
        type: String,
        required: true,
      },
    ],
    votos: [
      {
        type: String,
        required: true,
      },
    ],
    // docsSoporte: [{
    //   ref: "Documentos",
    //   type: Schema.Types.ObjectId,
    // }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Acta", ActaSchema);
