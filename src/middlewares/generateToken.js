import jwt from 'jsonwebtoken';
import config from '../config.js';

export const tokenSign = async (user) => {
  const newToken = jwt.sign(
    {
      _id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      cargo: user.cargo,
      rol: user.rol,
    },
    config.SECRET,
    { expiresIn: '7D' }
  );
  console.log(newToken);
  return newToken;
};

export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, config.SECRET);
  } catch (e) {
    return null;
  }
};
