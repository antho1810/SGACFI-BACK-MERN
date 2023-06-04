import { ROLES } from '../models/Rol.js'
import Rol from '../models/Rol.js'

export const createRoles = async () => {
  try {
    const count = await Rol.estimatedDocumentCount();

    if (count > 0) return;
    const values = await Promise.all([
      new Rol({ nombre: ROLES.decano }).save(),
      new Rol({ nombre: ROLES.secretaria }).save(),
      new Rol({ nombre: ROLES.participante }).save(),
    ])
    console.log(values)
  } catch (e) {
    console.error(e)
  }
}