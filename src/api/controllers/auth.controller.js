import User, { validate } from '../../models/User.js'
import Rol from '../../models/Rol.js'
import config from '../../config.js'

import { tokenSign } from '../../middlewares/generateToken.js'

import Joi from 'joi'

import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
    } catch (e) {
        return res.status(401).json({ message: e })
    }
    const {
        nombre,
        apellido,
        cargo,
        rol,
        cedula,
        telefono,
        direccion,
        email,
        password
    } = req.body;
    const newUser = new User({
        nombre,
        apellido,
        cargo,
        cedula,
        telefono,
        direccion,
        email,
        password: await User.encryptPassword(password)
    })
    if (rol) {
        const foundRoles = await Rol.find({ nombre: { $in: rol } })
        newUser.rol = foundRoles.map(rol => rol._id)
    } else {
        const defaultRol = await Rol.findOne({ nombre: "participante" })
        newUser.rol = [defaultRol._id]
    }
    const savedUser = await newUser.save()
    const tokenSession = await tokenSign(newUser)
    res.status(200).json({ message: savedUser, token: tokenSession })
}

export const signIn = async (req, res) => {
    try {
        const { error } = validateLogin(req.body)
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const userFound = await User.findOne({ email: req.body.email }).populate("rol");

        if (!userFound) {
            return res.status(400).json({ message: "Credenciales incorrectas" })
        }
        const passwordFound = await User.comparePassword(req.body.password, userFound.password)

        if (!passwordFound) {
            return res.status(400).json({ message: "Credenciales incorrectas" })
        }

        const tokenSession = await tokenSign(userFound)
        console.log(tokenSession);
        res.status(201).send({ data: tokenSession, message: "Ingreso éxitoso" })

    } catch (e) {
        res.status(401).send({ message: "Internal server error" })
    }
}

export const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("password"),
    })
    return schema.validate(data);
}