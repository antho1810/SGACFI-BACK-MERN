import Participantes from '../../models/Participantes.js'

// GET PARTICIPANTES
export const getParticipantes = async (req,res) => {
    const participantes = await Participantes.find();
    res.status(200).json(participantes)
}

// GET PARTICIPANTE BY ID
export const getParticipanteById = async (req,res) => {
    const participante = await Participantes.findById(req.params.id)
    res.status(200).json(participante)
}

// CREATE PARTICIPANTE
export const createParticipante = async (req, res) => {
    const {
        nombre,
        apellido,
        cargo
    } = req.body;

    const newParticipante = new Participantes({
        nombre,
        apellido,
        cargo
    })

    const participanteSaved = await newParticipante.save()

    res.status(200).json({message: "El participante fue añadido con éxito", info: participanteSaved})
}

// UPDATE PARTICIPANTE
export const updateParticipanteById = async (req, res) => {
    const updatedParticipante = await Participantes.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json({message: "El participante fue actualizado con éxito", info: updatedParticipante})
}

// DELETE PARTICIPANTE
export const deleteParticipanteById = async (req,res) => {
    const { id } = req.params;
    await Participantes.findByIdAndDelete(id)
    res.status(204).json({message: "El participante fue eliminado con éxito"})
}