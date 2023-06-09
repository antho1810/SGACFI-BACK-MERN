import Rol from '../models/Rol.js';
import User from '../models/User.js';

import { verifyToken } from './generateToken.js';

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ').pop();

    const tokenData = await verifyToken(token);

    req.userId = tokenData._id;

    const user = await User.findById(req.userId, { password: 0 });

    if (!user) return res.status(404).json({ message: 'no user found' });

    if (tokenData._id) {
      console.log(tokenData)
      next();
    } else {
      return res
        .status(403)
        .json({ message: 'No se ha provicionado el token' });
    }
  } catch (e) {
    return res.status(401).json({ message: 'No Autorizado' });
  }
};

export const isSecretaria = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Rol.find({ _id: { $in: user.rol } });

  console.log(roles);

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].nombre === 'secretaria') {
      next();
      return;
    }
  }

  return res
    .status(403)
    .json({ message: 'Requiere contar con un rol de secretaria' });
};

export const isDecano = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Rol.find({ _id: { $in: user.rol } });

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].nombre === 'decano') {
      next();
      return;
    }
  }

  return res
    .status(403)
    .json({ message: 'Requiere contar con un rol de decano' });
};

export const isSecretariaOrDecano = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Rol.find({ _id: { $in: user.rol } });

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].nombre === 'secretaria' || roles[i].nombre === 'decano') {
      next();
      return;
    }
  }

  return res
    .status(403)
    .json({ message: 'Requiere contar con un rol de secretaria o decano' });
};
