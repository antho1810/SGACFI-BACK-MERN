import User, { validate } from "../../models/User.js";
import Role from "../../models/Role.js";
import config from "../../config.js";

import Joi from 'joi'

import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  } catch (e) {
    return res.status(401).json({ message: e });
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
    password,
  } = req.body;

  const newUser = new User({
    nombre,
    apellido,
    cargo,
    cedula,
    telefono,
    direccion,
    email,
    password: await User.encryptPassword(password),
  });

  if (rol) {
    const foundRoles = await Role.find({ nombre: { $in: rol } });
    newUser.rol = foundRoles.map((role) => role._id);
  } else {
    const defaultRol = await Role.findOne({ nombre: "participante" });
    newUser.rol = [defaultRol._id];
  }

  const savedUser = await newUser.save();

  const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
    expiresIn: "7D",
    //expiresIn: 86400,  24h
  });

  res.status(200).json({ token });
};

export const signIn = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const userFound = await User.findOne({ email: req.body.email }).populate(
      "rol"
    );

    if (!userFound) {
      return res.status(400).json({ message: "Email no es correcto" });
    }

    const passwordFound = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!passwordFound) {
      return res.status(400).json({ message: "Contraseña no es correcta" });
    }

      const token = jwt.sign({ _id: userFound._id }, config.SECRET, {
        expiresIn: "7D"
      // expiresIn: 86400, 24h
      // expiresIn: "1m"
    });

     res.status(201).send({data: token, message: "Ingreso éxitoso" });
  } catch (e) {
      res.send({message: "Internal server error"})
  }

  // console.log(userFound);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Contraseña"),
  });
  return schema.validate(data);
};
