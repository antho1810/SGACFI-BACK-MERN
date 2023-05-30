import { ROLESARRAY } from '../models/Rol.js'

export const checkRolesExisted = (req,res,next) => {
    if (req.body.rol){
        for (let i = 0; i < req.body.rol.length; i++){
            if (!ROLESARRAY.includes(req.body.rol[i])){
                return res.status(400).json({
                    message: `El rol ${req.body.rol[i]} no se encuentra en el sistema`
                })
            }
        }
    }
    next()
}