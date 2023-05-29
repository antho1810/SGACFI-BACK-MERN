import mongoose, { Schema, model } from "mongoose";

const ActaSchema = new Schema(
  {
    numeroRef: {
      type: Number,
      // required: true,
      index: true,
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
      enum: ["En proceso", "Aprovado", "Desaprobado"],
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
        ref: "Participantes",
        type: Schema.Types.ObjectId,
      },
    ],
    miembrosAusentes: [
      {
        ref: "Participantes",
        type: Schema.Types.ObjectId,
      },
    ],
    miembrosInvitados: [
      {
        ref: "Participantes",
        type: Schema.Types.ObjectId,
      },
    ],
    cronograma: [{
      type: Object, required: true
      // HORA: {
      //   type: String,
      //   required: true
      // },
      // ACTIVIDAD: {
      //   type: String,
      //   required: true
      // }
    }],
    articulos:
    {
      type: [],
      required: true
    },
    docsSoporte: [{
      nombre: {type: String, required: true},
      archivo: {type: Buffer, required: true},
      contentType: {type: String, required: true}
      // ref: "documentosActa",
      // type: Schema.Types.ObjectId,
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ActaSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.numeroRef) {
    const lastDoc = await doc.constructor.findOne(
      {},
      {},
      { sort: { numeroRef: -1 } }
    );
    doc.numeroRef = lastDoc ? lastDoc.numeroRef + 1 : 1;
  }
  next();
});

const Acta = mongoose.model("Acta", ActaSchema);

export default Acta
