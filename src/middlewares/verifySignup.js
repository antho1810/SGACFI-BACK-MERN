import User from '../models/User.js'

export const checkDuplicateEmailAndCedulaAndTelefono = async (req,res, next) => {
    const email = await User.findOne({email: req.body.email})

    if (email) return res.status(400).json({ message: "El correo ya existe" })

    const cedula = await User.findOne({cedula: req.body.cedula})

    if (cedula) return res.status(400).json({ message: "La cédula ya existe"})

    const telefono = await User.findOne({telefono: req.body.telefono})

    if (telefono) return res.status(400).json({message: "El telefono ya se encuentra registrado"})
    
    next()
}