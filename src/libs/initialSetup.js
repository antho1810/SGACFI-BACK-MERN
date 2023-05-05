import {ROLES} from '../models/Role.js'
import Role from '../models/Role.js'
import { MODALIDADES } from '../models/actas/Modalidad.js'

import Modalidad from '../models/actas/Modalidad.js'

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount(); 
    
    if (count > 0) return;
    const values = await Promise.all([
      new Role({ nombre: ROLES.decano }).save(),
      new Role({ nombre: ROLES.secretaria }).save(),
      new Role({ nombre: ROLES.participante }).save(),
    ])
    console.log(values)
  } catch (e) {
    console.error(e)
  }
}
export const createModalidades = async () => {
  try {
    const count = await Modalidad.estimatedDocumentCount(); 
    
    if (count > 0) return;
    const values = await Promise.all([
      new Modalidad({ nombre: MODALIDADES.presencial }).save(),
      new Modalidad({ nombre: MODALIDADES.virtual }).save(),
      new Modalidad({ nombre: MODALIDADES.mixta}).save()
    ])
    console.log(values)
  } catch (e) {
    console.error(e)
   }
 }

