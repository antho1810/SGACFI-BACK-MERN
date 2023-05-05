import { Schema, model } from 'mongoose'

export const MODALIDADARRAY = ["presencial", "virtual", "mixta"]

export const MODALIDADES = {
  presencial: "presencial",
  virtual: "virtual",
  mixta: "mixta",
}

const ModalidadSchema = new Schema({
  nombre: String
}, {
  versionKey: false
})

export default model("Modalidad", ModalidadSchema)
