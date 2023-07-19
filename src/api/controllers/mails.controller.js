import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import path from "path";
import bodyReq from "../../config/http-common.js";

// Cambiar los valores de user y pass
const user = "sistemagestiondeactasparafi@gmail.com";
const pass = "lrzpwvszrppqwrql";

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
  const { numeroRef, lugar, modalidad, miembrosPresentes } = response.data;

  // ESTAS IMPRESIONES DE CONSOLA SON OPCIONALES, PERO NECESARIAS PARA LA COMPRENSIÓN DEL FUNCIONAMIENTO DEL CONTROLADOR
  console.log(numeroRef, lugar, modalidad);
  console.log(" ");

  // PARA RECORRER LOS MIEMBROS DEL ACTA, UTILIZAR Map()
  miembrosPresentes.map((presente, index) => {
    console.log(
      `Miembro #: ${index}\nNombre:${presente.nombre}\nApellido:${presente.apellido}\n--------------------------`
    );
  });

  // GENERAR PDF Y ENVIARLO
  const doc = new jsPDF();

  // ESCRIBE PRIMERA LINEA, ESTABLECE TAMAÑO DE FUENTE, COLOR, CONTENIDO Y POSICIÓN
  doc.setFontSize(32);
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
      <h3>Se lo mandó la persona: ${name}</h3>
      <p>${bodyEmail}</p>
  `,
    // DOCUMENTO ADJUNTO UBICADO EN root/src/temp/acta_ref_?.pdf
    attachments: [
      {
        filename: `acta_ref_${numeroRef}.pdf`,
        path: rootPath(numeroRef),
      },
    ],
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
