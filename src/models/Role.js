import { Schema, model } from "mongoose";

const RoleSchema = new Schema({
  nombre: String
},{
versionKey: false
})

export default model('Role', RoleSchema)