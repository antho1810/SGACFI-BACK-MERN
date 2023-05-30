import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import passwordComplexity from 'joi-password-complexity'

const UserSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    rol: [{
        ref: "Rol",
        type: Schema.Types.ObjectId
    }],
    cedula: {
        type: String,
        unique: true,
        required: true
    },
    telefono: {
        type: String,
        unique: true,
        required: true
    },
    direccion: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    contrasena: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

UserSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(Number(10))
    return await bcrypt.hash(password, salt)
}

UserSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

export const validate = (data) => {
    const schema = Joi.object({
        nombre: Joi.string().required().label("Nombre"),
        apellido: Joi.string().required().label("Apellido"),
        cargo: Joi.string().required().label("Cargo"),
        cedula: Joi.string().required().label("Cedula"),
        rol: Joi.array().required().label("Rol/roles"),
        telefono: Joi.string().required().label("Telefono"),
        direccion: Joi.string().required().label("Direccion"),
        email: Joi.string().email().required().label("Email"),
        contrasena: passwordComplexity().required().label("Contraseña"),
    })
    return schema.validate(data)
}

export default model('User', UserSchema)