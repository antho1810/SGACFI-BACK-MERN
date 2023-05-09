import Acta from "../../models/actas/Acta.js";
import Modalidad from "../../models/actas/Modalidad.js";

// GET ACTAS
export const getActas = async (req, res) => {
  const actas = await Acta.find();
  res.json(actas);
};

// GET ACTAS BY ID
export const getActasById = async (req, res) => {
  const acta = await Acta.findById(req.params.id);
  res.status(200).json(acta);
};

// POST ACTAS
export const createActas = async (req, res) => {
  const {
    numeroRef,
    fechaCreacion,
    lugar,
    modalidad,
    estado,
    horaInicia,
    horaFinal,
    // miembrosPresentes,
    // miembrosAusentes,
    // miembrosInvitados,
    // desarrolloActa,
    // votos,
    // docsSoporte
  } = req.body;

  const newActa = new Acta({
    numeroRef,
    fechaCreacion,
    lugar,
    estado,
    horaInicia,
    horaFinal,
    // miembrosPresentes,
    // miembrosAusentes,
    // miembrosInvitados,
    // desarrolloActa,
    // votos,
    // docsSoporte
  });

  if (modalidad) {
    const foundModalidades = await Modalidad.find({
      nombre: { $in: modalidad },
    });
    newActa.modalidad = foundModalidades.map((modalidad) => modalidad._id);
  } else {
    return res.status(400).json({ message: "Debe contar con una modalidad" });
  }

  console.log(newActa);

  const actaSaved = await newActa.save();

  res
    .status(200)
    .json({ message: "Acta guardada con éxito", infoActa: actaSaved });
};

// UDDATE ACTAS
export const updateActas = async (req, res) => {
  const updatedActa = await Acta.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({ message: "Acta actualizada con exito" });
};

// UPDATE STATUS ACTA
export const updateStatusActa = async (req, res) => {
  const foundedActa = await Acta.findByIdAndUpdate(req.params.id, req.body,{new: true});

  res.status(200).json({message: "Acta autorizada"})
 }

// DELETE ACTAS
export const deleteActas = async (req, res) => {
  const { id } = req.params;
  await Acta.findByIdAndDelete(id);
  res.status(204).json({ message: "Acta eliminada con exito" });
};


