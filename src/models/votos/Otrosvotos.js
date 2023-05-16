import { Schema, model } from "mongoose";

const VotoOtrosSchema = new Schema(
  {
    // Info Voto
    titloVoto: {
      type: String,
      required: true,
    },
    // Info Estudiante
    nombre: {
      type: String,
      required: true,
    },
    tipoDocumento: {
      type: String,
      enum: ["CC", "TI", "NIT", "PASAPORTE", "CE"],
      required: true,
    },
    noDocumento: {
      type: String,
      required: true,
    },
    programaEstudiante: {
      type: String,
      required: true,
    },
    periodo: {
      type: String,
      enum:["1er periodo", "2do periodo"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("VotoOtros", VotoOtrosSchema);
