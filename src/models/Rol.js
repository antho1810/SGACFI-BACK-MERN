import { Schema, model } from 'mongoose'

export const ROLES = {
    secretaria: "secretaria",
    decano: "decano",
    participante: "participante"
}

export const ROLESARRAY = ["secretaria", "decano", "participante"]

const RolSchema = new Schema({
    nombre: String
},
    {
        versionKey: false
    })

export default model('Rol', RolSchema)