import Acta from '../../models/Acta.js';
import path from "path";
import * as fs from "fs";
import actaData from "../../libs/acta.js";
import moment from "moment";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

// SEND ACTA
export const sendActa = async (req, res, next) => {
  const { numeroRef } = req.params;

  const __filename = fileURLToPath(import.meta.url);

  const __dirname = path.dirname(__filename);

  const acta = await Acta.findOne({ numeroRef })
    .populate("miembrosPresentes")
    .populate("miembrosAusentes")
    .populate("miembrosInvitados");

  if (!acta) {
    res.status(404).json({ error: "Acta no encontrada" });
  } else {
    const {
      numeroRef,
      estado,
      modalidad,
      lugar,
      miembrosPresentes,
      miembrosInvitados,
      miembrosAusentes,
      cronograma,
      horaInicio,
      horaFinal,
      fechaCreacion,
      articulos,
    } = acta;

    // Crear un flujo de respuesta para el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=archivo.pdf`);

    moment.locale("es");
    const horaInicioFormat = moment(horaInicio).format("h:mm a");
    const horaFinalFormat = moment(horaFinal).format("h:mm a");
    const fechaCreacionPrologoFormat = moment(fechaCreacion).format(
      `dddd DD [de] MMMM [de] YYYY`
    );

    const doc = new PDFDocument(); // Crear un nuevo documento PDF

    // Escribe el contenido del PDF directamente en el flujo de respuesta
    doc.pipe(res);

    // Agrega el contenido al PDF

    doc.fontSize(18).text(actaData ? actaData.TITULO : "...", 50, 50);
    doc.fontSize(12).text(actaData ? actaData.SUBTITULO : "...", 50, 80);
    doc
      .fontSize(12)
      .text(
        actaData
          ? `${actaData.REFERENCIA.acuerdo} - ${numeroRef} - ${actaData.REFERENCIA.anno}`
          : "...",
        50,
        100
      );
    doc.text(moment(fechaCreacion).format("D [de] MMMM [de] YYYY"), 50, 120);
    doc.text(`ACTA: ${estado}`, 400, 50);

    const contenidoTexto = `${actaData.PROLOGO.descAntesDeLaFecha} ${actaData.NOMBRE_INSTITUCION}, 
reunidos el ${fechaCreacionPrologoFormat} en el ${lugar}, ${actaData.PROLOGO.desDespuesFecha}, 
sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`;

    const lines = doc
      .font("Helvetica")
      .fontSize(12)
      .text(contenidoTexto, 50, 150, {
        width: 500,
        align: "left",
      })
      .text();

    doc.fontSize(12).text("Miembros Presentes:", 50, doc.y + 20);
    doc.fontSize(12).text("Miembros Ausentes:", 50, doc.y + 10);
    doc.fontSize(12).text("Miembros Invitados:", 50, doc.y + 10);

    doc.fontSize(12).text("DESARROLLO DEL ORDEN DEL DÍA", 50, doc.y + 20);
    const ordenDelDia = [
      "1. Apertura de la reunión:",
      "[Descripción del primer punto]",
      "2. Lectura y aprobación del acta anterior:",
      "[Descripción del segundo punto]",
      // ... agregar más puntos del orden del día
    ];
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(ordenDelDia.join("\n"), 50, doc.y + 10, {
        width: 500,
        align: "justify",
        lineGap: 5,
      });

    doc.addPage();
    doc.fontSize(18).text(actaData ? actaData.TITULO : "...", 50, 50);
    doc.fontSize(12).text(actaData ? actaData.SUBTITULO : "...", 50, 80);
    doc
      .fontSize(12)
      .text(
        actaData
          ? `${actaData.REFERENCIA.acuerdo} - ${numeroRef} - ${actaData.REFERENCIA.anno}`
          : "...",
        50,
        100
      );
    doc.text(moment(fechaCreacion).format("D [de] MMMM [de] YYYY"), 50, 120);

    doc.font("Helvetica").fontSize(12).text(lines, 50, 150);

    doc.fontSize(12).text("Articulos", 50, doc.y + 20);
    articulos.forEach((voto, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.fontSize(16).text(`Detalle de Voto ${index + 1}`, 50, 50);
      Object.keys(voto).forEach((votoInd, innerIndex) => {
        doc
          .font("Helvetica")
          .fontSize(12)
          .text(`${votoInd}: ${voto[votoInd]}`, 50, doc.y + 10);
      });
    });

    doc.fontSize(12).text("________________________", 50, doc.y + 30);
    doc.text(actaData.FIRMAS.JFNM.nombre, 50, doc.y + 5);
    doc.text(actaData.FIRMAS.JFNM.cargo, 50, doc.y + 5);
    doc.text("________________________", 250, doc.y - 30);
    doc.text(actaData.FIRMAS.OJD.nombre, 250, doc.y + 5);
    doc.text(actaData.FIRMAS.OJD.cargo, 250, doc.y + 5);
    // Finaliza el documento PDF
    doc.end();
  }
};

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

export const updateStatusIdActa = async (req, res) => {
  const { id } = req.params
  const foundedActa = await Acta.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({ message: 'Acta autorizada' });
};
