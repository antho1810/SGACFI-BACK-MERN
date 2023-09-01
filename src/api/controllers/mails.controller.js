import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import path from "path";
import bodyReq from "../../config/http-common.js";
import { actaData } from "../../libs/acta.js";
// import LogoUNAC from "../../../src/img/logo-unac.png"
import moment from "moment";
import * as fs from 'fs/promises'

// Cambiar los valores de user y pass (Borrar al momento de que las pruebas sean exitosas con las nuevas credenciales. 
// const user = "sistemagestiondeactasparafi@gmail.com";
// const pass = "lrzpwvszrppqwrql";

// Cambiar los valores de user y pass
const user = "actasconsejofi@unac.edu.co";
const pass = "lvsowhhhwtxllmxh";

// RUTA OBSOLETA - SOLO DE EJEMPLO PARA EL ENVIO DE UN CORREO SIMPLE
export const sendEmail = async (req, res) => {
  const { name, to, subject, bodyEmail } = req.body;
  const toArr = to.split(",");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user, // correo principal o de pruebas
      pass, // contraseña generada en google
    },
  });

  const mailOptions = {
    from: `<${user}>`,
    to: toArr,
    subject,
    text: bodyEmail,
    html: `
      <h1>Correo enviado desde nodemailer para ${to}</h1>
      <h3>Se lo mandó la persona: ${name}</h3>
      <p>${bodyEmail}</p>
  `,
  };

  try {
    transporter.sendMail(mailOptions, (err, info) => {
      err ? console.log(err) : console.log("Email enviado correctamente");
    });

    res.send({ message: "Enviado correctamente" });
  } catch (e) {
    console.error(e);
  }
};

// RUTA PRINCIPAL
export const sendEmailPdf = async (req, res) => {
  // DESESTRUCTURAMOS EL CUERPO DE LA PETICIÓN
  const { token, ref, name, to, subject, bodyEmail } = req.body;
  const toArr = to.split(",");

  // INICIALIZAMOS UNA PLANTILLA DE AXIOS CON UNA CONFIGURACIÓN PERSONALIZADA
  const httpCommon = bodyReq(token);

  // REALIZAMOS LA PETICIÓN A LA API
  const response = await httpCommon.get(`actas/referencia/${ref}`);

  // POR MEDIO DE LA DESESTRUCTURACIÓN, PUEDES OBTENER LOS DATOS INDIVIDUALES DE LA ACTA
  const {
    numeroRef,
    lugar,
    modalidad,
    miembrosPresentes,
    miembrosInvitados,
    miembrosAusentes,
    cronograma,
    horaInicio,
    horaFinal,
    fechaCreacion,
    articulos,
  } = response.data;

  // ESTAS IMPRESIONES DE CONSOLA SON OPCIONALES, PERO NECESARIAS PARA LA COMPRENSIÓN DEL FUNCIONAMIENTO DEL CONTROLADOR
  console.log(numeroRef, lugar, modalidad);
  console.log(" ");

  // PARA RECORRER LOS MIEMBROS DEL ACTA, UTILIZAR Map()
  miembrosPresentes.map((presente, index) => {
    console.log(
      `Miembro #: ${index}\nNombre:${presente.nombre}\nApellido:${presente.apellido}\n--------------------------`
    );
  });

  // FORMATEO DE DATOS
  moment.locale("es");
  const horaInicioFormat = moment(horaInicio).format("h:mm a");
  const horaFinalFormat = moment(horaFinal).format("h:mm a");
  const fechaCreacionPrologoFormat = moment(fechaCreacion).format(
    `dddd DD [de] MMMM [de] YYYY`
  );

  const lugarTexto =
    lugar === "LDS"
      ? "Laboratorio de sistemas (LDS)"
      : acta.lugar === "LADSIF"
      ? "Laboratorio de análisis de datos e investigación (LADSIF)"
      : acta
      ? acta.lugar
      : "...";

  const miembrosPresentesTexto = miembrosPresentes
    .map((miembro, index) => {
      return `${index + 1}. ${miembro.nombre} ${miembro.apellido}`;
    })
    .join("\n");
  const miembrosAusentesTexto = miembrosAusentes
    .map((miembro, index) => {
      return `${index + 1}. ${miembro.nombre} ${miembro.apellido}`;
    })
    .join("\n");
  const miembrosInvitadosTexto = miembrosInvitados
    .map((miembro, index) => {
      return `${index + 1}. ${miembro.nombre} ${miembro.apellido}`;
    })
    .join("\n");

  // GENERAR PDF Y ENVIARLO
  const doc = new jsPDF();

  // ESCRIBE PRIMERA LINEA, ESTABLECE TAMAÑO DE FUENTE, COLOR, CONTENIDO Y POSICIÓN
  // doc.addImage(LogoUNAC, "PNG", 10, 10, 50, 50, );
  doc.setFontSize(18);
  doc.text(actaData ? actaData.TITULO : "...", 50, 10);
  doc.setFontSize(12);
  doc.text(actaData ? actaData.SUBTITULO : "...", 95, 15);
  doc.setFontSize(12);
  doc.text(
    actaData
      ? `${actaData.REFERENCIA.acuerdo} - ${numeroRef} - ${actaData.REFERENCIA.anno}`
      : "...",
    90,
    25
  );
  doc.text(moment(fechaCreacion).format(`D [de] MMMM [de] YYYY`), 90, 30);

  // doc.setFontSize(12);
  // doc.text(
  //   `${actaData.PROLOGO.descAntesDeLaFecha} ${actaData.NOMBRE_INSTITUCION},
  //   reunidos el ${fechaCreacionPrologoFormat} en el ${lugarTexto}, ${actaData.PROLOGO.desDespuesFecha},
  //   sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`,
  //   10,
  //   40
  // );
  const contenidoTexto = `${actaData.PROLOGO.descAntesDeLaFecha} ${actaData.NOMBRE_INSTITUCION}, 
reunidos el ${fechaCreacionPrologoFormat} en el ${lugarTexto}, ${actaData.PROLOGO.desDespuesFecha}, 
sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`;

  // Dividir el contenido en líneas
  const lines = doc.splitTextToSize(
    contenidoTexto,
    doc.internal.pageSize.getWidth() - 20
  );

  // Agregar las líneas de texto
  doc.text(lines, 10, 40);

  doc.setFontSize(12);
  doc.text("Miembros Presentes:", 10, 70);
  doc.text(miembrosPresentesTexto, 20, 70);
  doc.setFontSize(12);
  doc.text("Miembros Ausentes:", 10, 80);
  doc.text(miembrosAusentesTexto, 20, 70);
  doc.setFontSize(12);
  doc.text("Miembros Invitados:", 10, 90);
  doc.text(miembrosInvitadosTexto, 20, 70);

  doc.setFontSize(12);
  doc.text("DESARROLLO DEL ORDEN DEL DIA", 50, 100);
  // Dividir el cronograma en líneas individuales
  const elementosCronograma = cronograma.split(/\\n\\s*\\n/);

  // Crear un listado para el cronograma
  const cronogramaTexto = elementosCronograma
    .map((elemento, index) => {
      return `${index + 1}. ${elemento}`;
    })
    .join("\n");
  doc.text(cronogramaTexto, 20, 110);
  // const ordenDelDia = [
  //   "1. Apertura de la reunión:",
  //   "[Descripción del primer punto]",
  //   "2. Lectura y aprobación del acta anterior:",
  //   "[Descripción del segundo punto]",
  //   // ... agregar más puntos del orden del día
  // ];
  // doc.text(ordenDelDia, 20, 110);

  // Agregar más contenido siguiendo el mismo patrón

  doc.setFontSize(12);
  doc.text(`________________________`, 30, 250);
  doc.text(`${actaData.FIRMAS.JFNM.nombre}`, 30, 255);
  doc.text(`${actaData.FIRMAS.JFNM.cargo}`, 30, 260);
  doc.text(`________________________`, 100, 250);
  doc.text(`${actaData.FIRMAS.OJD.nombre}`, 100, 255);
  doc.text(`${actaData.FIRMAS.OJD.cargo}`, 100, 260);

  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(18, 47, 117);
  doc.text(`Número de Referencia: ${numeroRef}`, 5, 20);

  doc.setFontSize(24);
  doc.setTextColor(100);
  doc.text(`Lugar del acta: ${lugar}`, 5, 40);

  // GUARDA EL PDF EN LA CARPETA TEMPORAL
  doc.save(`src/temp/acta_ref_${numeroRef}.pdf`);

  const rootPath = (refFile) => {
    return path.join(process.cwd(), `src/temp/acta_ref_${refFile}.pdf`);
  };

  async function getActaFiles(ref) {
    try {
      const files = await fs.readdir(
        path.join(
          process.cwd(),
          `src/uploads/actas/docs-soportes/soportes_ref_${ref}`
        )
      );

      return files.map((file) => ({
        filename: file,
        path: `src/uploads/actas/docs-soportes/soportes_ref_${ref}/${file}`,
      }));
    } catch (err) {
      throw err;
    }
  }

  const actaFiles = await getActaFiles(numeroRef);

  actaFiles.push({
    filename: `acta_ref_${numeroRef}.pdf`,
    path: path.join(process.cwd(), `src/temp/acta_ref_${numeroRef}.pdf`),
  });

  console.log(actaFiles);

  // EMAIL OPTIONS

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user, // correo principal o de pruebas
      pass, // contraseña generada en google
    },
  });

  const mailOptions = {
    from: `<${user}>`,
    to: toArr,
    subject,
    text: bodyEmail,
    html: `
      <h1>Correo enviado desde nodemailer para ${to}</h1>
      <p>${bodyEmail}</p>
      <span style="color: #908890;font-size: 16px; font-weight: bold;">
      NOTA: Favor no responder a este mensaje, debido a que es un correo de divulgación, 
      cualquier inquietud o duda que tenga envíela al correo de la persona o departamento al que se hace mención.
      </span>

    <div style="background-color: #ffffff; padding: 20px;">
        <p style="color: #333;">Gracias por su atención.</p>
        <p style="color: #333;">Saludos cordiales, ${name}</p>
    </div>
  `,
    // DOCUMENTO ADJUNTO UBICADO EN root/src/temp/acta_ref_?.pdf
    attachments: actaFiles
  };

  try {
    transporter.sendMail(mailOptions, (err, info) => {
      err ? console.log(err) : console.log("Email enviado correctamente");
    });

    res.send({ message: "Recibido correctamente" });
  } catch (e) {
    console.error(e);
  }
};
