import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import path from "path";
import bodyReq from "../../config/http-common.js";

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
 doc.setFontSize(18);
 doc.text(actaData ? actaData.TITULO : "...", 50, 10, { fontWeight: 'bold' });
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
 //   reunidos el ${fechaCreacionPrologoFormat} en el ${lugar}, ${actaData.PROLOGO.desDespuesFecha},
 //   sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`,
 //   10,
 //   40
 // );
 const contenidoTexto = `${actaData.PROLOGO.descAntesDeLaFecha} ${actaData.NOMBRE_INSTITUCION}, 
reunidos el ${fechaCreacionPrologoFormat} en el ${lugar}, ${actaData.PROLOGO.desDespuesFecha}, 
sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`;

 // Dividir el contenido en líneas
 const lines = doc.splitTextToSize(
   contenidoTexto,
   doc.internal.pageSize.getWidth() - 20
 );

 // Agregar las líneas de texto
 doc.text(lines, 10, 40);

 doc.setFontSize(12);
 doc.text("Miembros Presentes:", 10, 70, { fontWeight: 'bold' });
 // doc.text(miembrosPresentes, 20, 70);
 doc.setFontSize(12);
 doc.text("Miembros Ausentes:", 10, 80, { fontWeight: 'bold' });
 // doc.text(miembrosPresentes, 20, 70);
 doc.setFontSize(12);
 doc.text("Miembros Invitados:", 10, 90, { fontWeight: 'bold' });
 // doc.text(miembrosPresentes, 20, 70);

 doc.setFontSize(12);
  doc.text("DESARROLLO DEL ORDEN DEL DIA", 50, 100, { fontWeight: 'bold' });
  
  doc.setFontSize(12);
  doc.text(`________________________`, 30, 250);
  doc.text(`${actaData.FIRMAS.JFNM.nombre}`, 30, 255);
  doc.text(`${actaData.FIRMAS.JFNM.cargo}`, 30, 260);
  doc.text(`________________________`, 100, 250);
  doc.text(`${actaData.FIRMAS.OJD.nombre}`, 100, 255);
  doc.text(`${actaData.FIRMAS.OJD.cargo}`, 100, 260);

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
