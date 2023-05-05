import { ROLESARRAY } from "../models/Role.js"
import User from "../models/User.js"

export const checkDuplicateEmailAndCedulaAndTelefono = async (req, res, next) => {
  const email = await User.findOne({ email: req.body.email });
  if (email) return res.status(400).json({ message: "El correo ya existe" });
  
  const cedula = await User.findOne({ cedula: req.body.cedula });
  if (cedula) return res.status(400).json({ message: "La cédula ya existe" });

  const telefono = await User.findOne({ telefono: req.body.telefono })
  if(telefono) return res.status(400).json({message: "El telefono ya se encuentra registrado"})
  
  next();
}

export const checkRolesExisted = (req, res, next) => {
  if (req.body.rol) {
    for (let i = 0; i < req.body.rol.length; i++) {
      if (!ROLESARRAY.includes(req.body.rol[i])) {
        return res
          .status(400)
          .json({ message: `El rol ${req.body.rol[i]} no se encuentra en el sistema` })
      }
    }
  }

  next()
}

