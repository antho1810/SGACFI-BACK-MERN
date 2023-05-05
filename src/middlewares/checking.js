import { MODALIDADARRAY } from "../models/actas/Modalidad.js";
import {ROLESARRAY} from "../models/Role.js"


export const checkModalidadExisted = (req, res, next) => {
  if (req.body.modalidad) {
    for (let i = 0; i < req.body.modalidad.length; i++) {
      if (!MODALIDADARRAY.includes(req.body.modalidad[i])) {
        return res
          .status(400)
          .json({
            message: `La modalidad ${req.body.modalidad[i]} no se encuentra en el sistema`,
          });
      }
    }
  }

  next();
};
export const checkRolesExisted = (req, res, next) => {
  if (req.body.rol) {
    for (let i = 0; i < req.body.rol.length; i++) {
      if (!ROLESARRAY.includes(req.body.rol[i])) {
        return res
          .status(400)
          .json({
            message: `El rol ${req.body.rol[i]} no se encuentra en el sistema`,
          });
      }
    }
  }

  next();
};

