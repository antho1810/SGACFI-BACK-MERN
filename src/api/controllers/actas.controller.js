import Acta from '../../models/Acta.js';

// GET ACTAS
export const getActas = async (req, res) => {
  const actas = await Acta.find()
    .populate('miembrosPresentes')
    .populate('miembrosAusentes')
    .populate('miembrosInvitados');
  res.json(actas);
};

// POST ACTAS
export const createActas = async (req, res) => {
  const {
    numeroRef,
    lugar,
    modalidad,
    horaInicio,
    horaFinal,
    miembrosPresentes,
    miembrosAusentes,
    miembrosInvitados,
    cronograma,
    articulos,
    docsSoporte,
  } = req.body;

  const newActa = new Acta({
    numeroRef,
    lugar,
    modalidad,
    horaInicio,
    horaFinal,
    miembrosPresentes,
    miembrosAusentes,
    miembrosInvitados,
    cronograma,
    articulos,
    docsSoporte,
  });

  console.log(newActa);

  if (
    modalidad === 'mixta' ||
    modalidad === 'virtual' ||
    modalidad === 'presencial'
  ) {
    const actaSaved = await newActa.save();
    res
      .status(200)
      .json({ message: 'Acta guardada con éxito', infoActa: actaSaved });
  } else {
    return res.status(401).json({ message: 'modalidad no existe' });
  }
};

// Obtener los detalles de una acta específica por número de referencia
export const getActaByRef = async (req, res, next) => {
  try {
    const { numeroRef } = req.params;
    const acta = await Acta.findOne({ numeroRef })
      .populate('miembrosPresentes')
      .populate('miembrosAusentes')
      .populate('miembrosInvitados');
    if (!acta) {
      res.status(404).json({ error: 'Acta no encontrada' });
    } else {
      res.json(acta);
    }
  } catch (error) {
    next(error);
  }
};

// Actualizar una acta
export const updateActaByRef = async (req, res, next) => {
  try {
    const { numeroRef } = req.params;

    const actaActualizada = await Acta.findOneAndUpdate(
      { numeroRef },
      req.body,
      {
        new: true,
      }
    );
    if (!actaActualizada) {
      res.status(404).json({ error: 'Acta no encontrada' });
    } else {
      res.json(actaActualizada);
    }
  } catch (error) {
    next(error);
  }
};

// Eliminar una acta
export const deleteActaByRef = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actaEliminada = await Acta.findByIdAndDelete(id);
    if (!actaEliminada) {
      res.status(404).json({ error: 'Acta no encontrada' });
    } else {
      res.json({ message: 'Acta eliminada correctamente' });
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE STATUS ACTA
export const updateStatusActa = async (req, res) => {
  const { numeroRef } = req.params
  const foundedActa = await Acta.findOneAndUpdate({ numeroRef }, req.body, {
    new: true,
  });

  res.status(200).json({ message: 'Acta autorizada' });
};
