import { Schema, model } from "mongoose";

export const ROLES = ["decano", "secretaria", "participante"];

const RoleSchema = new Schema({
  nombre: String
},{
versionKey: false
})

export default model('Role', RoleSchema)