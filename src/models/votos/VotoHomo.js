import {Schema, model} from "mongoose"

const VotoHomologacionSchema = new Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum:["externa", "interna"]
    },
    // Info Estudiante
    nombreEstudiante: {
      type: String,
      required: true,
    },
    tipoDoc: {
      type: String,
      enum: ["CC", "TI", "NIT", "PASAPORTE", "CE"],
      required: true,
    },
    noDocument: {
      type: String,
      required: true,
    },
    programaEstudiante: {
      type: String,
      required: true,
    },
    periodo: {
      type: String,
      enum: ["1er periodo", "2do periodo"],
      required: true,
    },
    // Info Materia
    nombreLicei: {
      type: String,
      required: true,
    },
    nombreEquivalente: {
      type: String,
      required: true,
    },
    nota: {
      type: Number,
      required: true,
    },
    credito: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("VotoHomologacion", VotoHomologacionSchema);