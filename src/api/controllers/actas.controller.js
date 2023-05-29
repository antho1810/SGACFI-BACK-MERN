import Acta from "../../models/Acta.js";
// import Modalidad from "../../models/actas/Modalidad.js";

// GET ACTAS
export const getActas = async (req, res) => {
  const actas = await Acta.find().populate("miembrosPresentes")
    .populate("miembrosAusentes")
    .populate("miembrosInvitados");
  res.json(actas);
};

// POST ACTAS
export const createActas = async (req, res) => {
  const {
    numeroRef,
    lugar,
    modalidad,
    horaInicia,
    horaFinal,
    miembrosPresentes,
    miembrosAusentes,
    miembrosInvitados,
    cronograma,
    articulos,
    docsSoporte
  } = req.body;

  const newActa = new Acta({
    numeroRef,
    lugar,
    modalidad,
    horaInicia,
    horaFinal,
    miembrosPresentes,
    miembrosAusentes,
    miembrosInvitados,
    cronograma,
    articulos,
    docsSoporte
  });

  console.log(newActa);

  if (modalidad === "mixta" ||
    modalidad === "virtual" ||
    modalidad === "presencial") {
    const actaSaved = await newActa.save();

    res
      .status(200)
      .json({ message: "Acta guardada con éxito", infoActa: actaSaved });
  } else {
    res.status(401).json({ message: "Modalidad no existe" });
  }


};

// GET ACTAS BY ID
// export const getActasById = async (req, res) => {
//   const acta = await Acta.findById(req.params.id)
//     .populate("miembrosPresentes")
//     .populate("miembrosAusentes")
//     .populate("miembrosInvitados");
//   res.status(200).json(acta);
// };

// GET ACTAS BY NumeroREF
export const getActasByRef = async (req, res) => {
  try {
    const { numeroRef } = req.params;

    const acta = await Acta.findOne({ numeroRef })
      .populate("miembrosPresentes")
      .populate("miembrosAusentes")
      .populate("miembrosInvitados");
    if (!acta) {
      res.status(404).json({ error: "Acta no encontrada" });
    } else {
      res.json(acta);
    }
    res.status(200).json(acta);
  } catch (error) {
    next(error);
  }
};

// UDDATE ACTAS
export const updateActaByRef = async (req, res) => {
  try {
    const { numeroRef } = req.params

    const updatedActa = await Acta.findOneAndUpdate({ numeroRef }, req.body, {
      new: true,
    });

    if (!updateActa) {
      res.status(404).json({ error: "Acta no encontrada" });
    } else {
      res.json(updatedActa);
      res.status(200).json({ message: "Acta actualizada con exito" });
    }
  } catch (error) {
    next(error);
  }
};

// UPDATE STATUS ACTA
export const updateStatusActa = async (req, res) => {

  const { numeroRef } = req.params;
  const foundedActa = await Acta.findOneAndUpdate({ numroRef }, req.body, { new: true });

  res.status(200).json({ message: "Acta autorizada" })
}

// DELETE ACTAS
export const deleteActas = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteActa = await Acta.findByIdAndDelete(id);
    if (!deleteActa) {
      res.status(404).json({ error: "Acta no encontrada" });
    } else {

      res.status(204).json({ message: "Acta eliminada con exito" });
    }

  } catch (error) {
    next(error)
  }

};


