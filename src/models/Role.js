import { Schema, model } from "mongoose";

export const ROLES = {
  decano: "decano",
  secretaria: "secretaria",
  participante: "participante"
}

export const ROLESARRAY = ["decano", "secretaria", "participante"];

const RoleSchema = new Schema({
  nombre: String
},{
versionKey: false
})

export default model('Role', RoleSchema)