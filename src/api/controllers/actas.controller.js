import Acta from '../../models/Acta.js'

// GET ACTAS
export const getActas = async (req, res) => {
    const actas = await Acta.find();
    res.json(actas)
}

// GET ACTAS BY ID

// POST ACTAS
export const createActas = async (req, res) => {
    const {
        numeroRef,
        fechaCreacion,
        lugar,
        modalidad,
        horaInicio,
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
        modalidad,
        horaInicio,
        horaFinal,
        // miembrosPresentes,
        // miembrosAusentes,
        // miembrosInvitados,
        // desarrolloActa,
        // votos,
        // docsSoporte
    })

    console.log(newActa)

    const actaSaved = await newActa.save()

    res.status(200).json({message: "Acta guardada con éxito", infoActa: actaSaved})
}

// UDDATE ACTAS
export const updateActas = async (req, res) => {

    const updatedActa = await Acta.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json({message: "Acta actualizada con exito"})
}

// DELETE ACTAS
export const deleteActas = async (req, res) => {

    const { id } = req.params;
    await Acta.findByIdAndDelete(id)
    res.status(204).json({message: "Acta eliminada con exito"})
    
}