import {Schema, model} from "mongoose"

const VotoExpTituloAcademicoSchema = new Schema({
  nombreAspirante: {
    type: String,
    required: true
  },
  tipoDoc: {
    type: String,
    enum:["CC", "TI", "NIT", "PASAPORTE", "CE"],
    required: true
  },
  noDocument: {
    type: String,
    required: true
  },
  codigoSnies: {
    type: String,
    required: true
  },
  tituloOtorga: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

export default model("VotoExpTituloAcademico", VotoExpTituloAcademicoSchema);