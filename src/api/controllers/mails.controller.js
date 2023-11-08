import nodemailer from "nodemailer";
import {
  Document,
  Paragraph,
  Header,
  Packer,
  HeadingLevel,
  Footer,
  TextRun,
  AlignmentType,
  TableRow,
  TableCell,
  Table,
  VerticalAlign,
  TextDirection,
  WidthType,
  TableLayout,
  TableLayoutType,
  HeightRule,
  BorderStyle,
  Media,
  ImageRun,
  PageNumber,
  Tab,
} from "docx";
import path from "path";
import bodyReq from "../../config/http-common.js";
import actaData from "../../libs/acta.js";
// import LogoUNAC from "../../../src/img/logo-unac.png"
import moment from "moment";
import * as fs from "fs/promises";
import * as fss from "fs";
// import * as jsPDF from "jspdf"

// Cambiar los valores de user y pass
const user = "actasconsejofi@unac.edu.co";
const pass = "lvsowhhhwtxllmxh";

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
  } = response.data;

  // ESTAS IMPRESIONES DE CONSOLA SON OPCIONALES, PERO NECESARIAS PARA LA COMPRENSIÓN DEL FUNCIONAMIENTO DEL CONTROLADOR
  // console.log(numeroRef, lugar, modalidad);

  // --- DOCX ---
  const rows = [
    // DEFINE LAS FILAS QUE HAYAN EN LA TABLA
    // ESTA PRIMERA FILA SERÁ NUESTROS ENCABEZADOS
    new TableRow({
      children: [
        // CREAMOS LAS CELDAS
        // ENCABEZADO PARA NOMBRE
        new TableCell({
          children: [
            // RELLENAMOS LA CELDA CON UN TITULO, PARRAFO, ENTRE OTROS
            new Paragraph({
              text: "N°",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        // ENCABEZADO PARA APELLIDO
        new TableCell({
          children: [
            new Paragraph({
              text: "Nombre Completo",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        // ENCABEZADO PARA CARGO
        new TableCell({
          children: [
            new Paragraph({
              text: "Cargo",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
      ],
    }),
  ];

  const rowsHomo = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: "Materia Aprobada",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "Nota Final",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "Materia Equivalente",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "Créditos",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
      ],
    }),
  ];

  const rowsAutrz = [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: "N°",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "Nombre del aspirante",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "Tipo de documento",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "N° de documento",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "Programa profesional",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: "Código SNIES",
              alignment: AlignmentType.CENTER,
              style: "Strong",
            }),
          ],
        }),
      ],
    }),
  ];

  // PARA RECORRER LOS MIEMBROS DEL ACTA, UTILIZAR Map()
  miembrosPresentes.map((presente, index) => {
    console.log(
      `Miembro #: ${index}\nNombre:${presente.nombre}\nApellido:${presente.apellido}\n--------------------------`
    );
  });

  moment.locale("es");
  const horaInicioFormat = moment(horaInicio).format("h:mm a");
  const horaFinalFormat = moment(horaFinal).format("h:mm a");
  const fechaCreacionPrologoFormat = moment(fechaCreacion).format(
    `dddd DD [de] MMMM [de] YYYY`
  );

  // FUNCIÓN QUE RECOPILA LOS MIEMBROS Y LOS AGREGA A LAS FILAS DE LA TABLA
  function createMembersArrayForTablePresent() {
    return miembrosPresentes.map((miembro, index) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              // CELDA PARA NOMBRE
              new Paragraph({
                text: (index + 1).toString(),
              }),
            ],
          }),
          // CELDA PARA APELLIDO
          new TableCell({
            children: [
              new Paragraph({
                text: `${miembro.nombre} ${miembro.apellido}`,
              }),
            ],
          }),
          // CELDA PARA CARGO
          new TableCell({
            children: [
              new Paragraph({
                text: miembro.cargo,
              }),
            ],
          }),
        ],
      });
    });
  }
  function createMembersArrayForTableAusent() {
    return miembrosAusentes.map((miembro, index) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              // CELDA PARA NOMBRE
              new Paragraph({
                text: (index + 1).toString(),
              }),
            ],
          }),
          // CELDA PARA APELLIDO
          new TableCell({
            children: [
              new Paragraph({
                text: `${miembro.nombre} ${miembro.apellido}`,
              }),
            ],
          }),
          // CELDA PARA CARGO
          new TableCell({
            children: [
              new Paragraph({
                text: miembro.cargo,
              }),
            ],
          }),
        ],
      });
    });
  }
  function createMembersArrayForTableInvit() {
    return miembrosInvitados.map((miembro, index) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              // CELDA PARA NOMBRE
              new Paragraph({
                text: (index + 1).toString(),
              }),
            ],
          }),
          // CELDA PARA APELLIDO
          new TableCell({
            children: [
              new Paragraph({
                text: `${miembro.nombre} ${miembro.apellido}`,
              }),
            ],
          }),
          // CELDA PARA CARGO
          new TableCell({
            children: [
              new Paragraph({
                text: miembro.cargo,
              }),
            ],
          }),
        ],
      });
    });
  }

  function createArticuloHomologa() {
    return articulos
      .filter(
        (articulo) =>
          articulo.titulo === "Homologación Interna" ||
          articulo.titulo === "Homologación Externa"
      )
      .map((articulo) => {
        return new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.materiaAprobada,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.notaCalificacion,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.materiaEquivalente,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.credito,
                }),
              ],
            }),
          ],
        });
      });
  }

  function createAutoriza() {
    return articulos
      .filter(
        (articulo) =>
          articulo.titulo === "Autorización de expedición de títulos académicos"
      )
      .map((articulo, index) => {
        return new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: (index + 1).toString(),
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.nombreAspirante,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.tipoDocumento,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.noDocumento,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.programaEstudiante,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: articulo.codigoSnies,
                }),
              ],
            }),
          ],
        });
      });
  }

  let autoRowsPresent = createMembersArrayForTablePresent();
  let autoRowsAusent = createMembersArrayForTableAusent();
  let autoRowsInvit = createMembersArrayForTableInvit();
  let autoRowsHomologa = createArticuloHomologa();
  let autoRowsAutoriza = createAutoriza();

  const fixedRowsHomologa = rowsHomo.concat(autoRowsHomologa);
  const fixedRowsAutoriza = rowsAutrz.concat(autoRowsAutoriza);
  const fixedRowsPresent = rows.concat(autoRowsPresent);
  const fixedRowsAusent = rows.concat(autoRowsAusent);
  const fixedRowsInvit = rows.concat(autoRowsInvit);

  // USO DE TABLAS
  const tablePresent = new Table({
    rows: fixedRowsPresent,
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    alignment: AlignmentType.CENTER,
  });
  const tableAusent = new Table({
    rows: fixedRowsAusent,
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    alignment: AlignmentType.CENTER,
  });
  const tableInvit = new Table({
    rows: fixedRowsInvit,
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    alignment: AlignmentType.CENTER,
  });
  const tableHomologa = new Table({
    rows: fixedRowsHomologa,
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    alignment: AlignmentType.CENTER,
  });

  const tableAutoriza = new Table({
    rows: fixedRowsAutoriza,
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    alignment: AlignmentType.CENTER,
  });

  const firma = new Table({
    width: {
      size: 100,
      type: WidthType.AUTO,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
              left: {
                style: BorderStyle.NONE,
              },
              bottom: {
                style: BorderStyle.NONE,
              },
              right: {
                style: BorderStyle.NONE,
              },
            },
            children: [
              new Paragraph({
                text: actaData.FIRMAS.JFNM.nombre,
                style: "Strong",
              }),
              new Paragraph({
                text: actaData.FIRMAS.JFNM.cargo,
                style: "Strong",
              }),
            ],
          }),
          new TableCell({
            width: {
              size: 50,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
              left: {
                style: BorderStyle.NONE,
              },
              bottom: {
                style: BorderStyle.NONE,
              },
              right: {
                style: BorderStyle.NONE,
              },
            },
            children: [
              new Paragraph({
                text: actaData.FIRMAS.OJD.nombre,
                style: "Strong",
              }),
              new Paragraph({
                text: actaData.FIRMAS.OJD.cargo,
                style: "Strong",
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const parrafosArticulos = [];
  const votosProcesados = new Set();

  articulos.forEach((voto, index) => {
    const clave = `${voto.titulo}_${voto.nombreAspirante}`;
    if (!votosProcesados.has(clave)) {
      votosProcesados.add(clave);

      const parrafos = [
        new Paragraph({
          children: [
            new TextRun({
              text: `Artículos ${(index + 1).toString()} ${voto.titulo}_${
                voto.nombreAspirante
              }`,
              bold: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Aprobar la solicitud de ${voto.titulo} del estudiante ${voto.nombreAspirante}, identificado con ${voto.tipoDocumento} número ${voto.noDocumento}. ${voto.observacion}. Aprobado por ${voto.Aprobacion}`,
              alignment: AlignmentType.JUSTIFIED,
            }),
          ],
        }),
      ];

      // Condicionales para agregar tablas adicionales según el título del artículo
      if (
        voto.titulo === "Homologación Interna" ||
        voto.titulo === "Homologación Externa"
      ) {
        parrafos.push(tableHomologa); // Agregar tabla de homologación
      } else if (
        voto.titulo === "Autorización de expedición de títulos académicos"
      ) {
        parrafos.push(tableAutoriza); // Agregar tabla de autorización de título
      }

      parrafosArticulos.push(parrafos);
    }
  });

  const lugarTexto =
    lugar === "LDS"
      ? "Laboratorio de sistemas (LDS)"
      : lugar === "LADSIF"
      ? "Laboratorio de análisis de datos e investigación (LADSIF)"
      : lugar
      ? lugar
      : "...";

  // USO BÁSICO
  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              // image,
              // imageBase64,
              new Paragraph({
                text: actaData.TITULO,
                alignment: AlignmentType.CENTER,
                style: "Strong",
              }),
              new Paragraph({
                text: actaData.SUBTITULO,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `${actaData.REFERENCIA.acuerdo} - ${numeroRef} - ${actaData.REFERENCIA.anno}`,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: moment(fechaCreacion).format(`D [de] MMMM [de] YYYY`),
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `ACTA: ${estado}`,
                alignment: AlignmentType.END,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              firma,
              new Paragraph({
                alignment: AlignmentType.END,
                children: [
                  new TextRun({
                    children: ["Page Number: ", PageNumber.CURRENT],
                  }),
                  new TextRun({
                    children: [" to ", PageNumber.TOTAL_PAGES],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // CREAMOS PARRAFOS INDEPENDIENTES
          new Paragraph({
            text: `${actaData.PROLOGO.descAntesDeLaFecha} ${actaData.NOMBRE_INSTITUCION}, reunidos el ${fechaCreacionPrologoFormat}, de manera ${modalidad} en el ${lugarTexto} de la Facultad de Ingeniería, ${actaData.PROLOGO.desDespuesFecha}, sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`,
            alignment: AlignmentType.JUSTIFIED,
          }),

          new Paragraph({
            text: "MIEMBROS PRESENTES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
          // table,
          tablePresent,
          new Paragraph({
            text: "MIEMBROS AUSENTES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
          // table,
          tableAusent,
          new Paragraph({
            text: "MIEMBROS INVITADOS",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
          tableInvit,
          new Paragraph({
            text: "DESARROLLO DEL ORDEN DEL DIA",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            style: {
              paragraph: {
                color: "000000",
              },
            },
          }),
          ...cronograma.split("\n").map(
            (line) =>
              new Paragraph({
                text: line,
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                  before: 200,
                  after: 200,
                },
                style: {
                  spacing: 0,
                },
              })
          ),
          new Paragraph({
            text: "RESUELVE",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            style: "Strong"
          }),
          ...parrafosArticulos.flat(),
        ],
      },
    ],
  });

  // GENERAR PDF Y ENVIARLO
  // const doc = new jsPDF();

  // ESCRIBE PRIMERA LINEA, ESTABLECE TAMAÑO DE FUENTE, COLOR, CONTENIDO Y POSICIÓN
  // doc.addImage(LogoUNAC, "PNG", 10, 10, 50, 50, );
  // doc.setFontSize(18);
  // doc.text(actaData ? actaData.TITULO : "...", 50, 10);
  // doc.setFontSize(12);
  // doc.text(actaData ? actaData.SUBTITULO : "...", 95, 15);
  // doc.setFontSize(12);
  // doc.text(
  //   actaData
  //     ? `${actaData.REFERENCIA.acuerdo} - ${numeroRef} - ${actaData.REFERENCIA.anno}`
  //     : "...",
  //   90,
  //   25
  // );
  // doc.text(moment(fechaCreacion).format(`D [de] MMMM [de] YYYY`), 90, 30);

  // doc.setFontSize(12);
  // doc.text(
  //   `${actaData.PROLOGO.descAntesDeLaFecha} ${actaData.NOMBRE_INSTITUCION},
  //   reunidos el ${fechaCreacionPrologoFormat} en el ${lugarTexto}, ${actaData.PROLOGO.desDespuesFecha},
  //   sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`,
  //   10,
  //   40
  // );
  //   const contenidoTexto = `${actaData.PROLOGO.descAntesDeLaFecha} ${actaData.NOMBRE_INSTITUCION},
  // reunidos el ${fechaCreacionPrologoFormat} en el ${lugarTexto}, ${actaData.PROLOGO.desDespuesFecha},
  // sesionó de ${horaInicioFormat} - ${horaFinalFormat}, ${actaData.PROLOGO.desFinal}`;

  // Dividir el contenido en líneas
  // const lines = doc.splitTextToSize(
  //   contenidoTexto,
  //   doc.internal.pageSize.getWidth() - 20
  // );

  // Agregar las líneas de texto
  // doc.text(lines, 10, 40);

  // doc.setFontSize(12);
  // doc.text("Miembros Presentes:", 10, 70);
  // doc.text(miembrosPresentes, 20, 70);
  // doc.setFontSize(12);
  // doc.text("Miembros Ausentes:", 10, 80);
  // doc.text(miembrosPresentes, 20, 70);
  // doc.setFontSize(12);
  // doc.text("Miembros Invitados:", 10, 90);
  // doc.text(miembrosPresentes, 20, 70);

  // doc.setFontSize(12);
  // doc.text("DESARROLLO DEL ORDEN DEL DIA", 50, 100);
  // const ordenDelDia = [
  //   "1. Apertura de la reunión:",
  //   "[Descripción del primer punto]",
  //   "2. Lectura y aprobación del acta anterior:",
  //   "[Descripción del segundo punto]",
  //   // ... agregar más puntos del orden del día
  // ];
  // doc.text(ordenDelDia, 20, 110);

  // Agregar más contenido siguiendo el mismo patrón

  // doc.setFontSize(12);
  // doc.text(`________________________`, 30, 250);
  // doc.text(`${actaData.FIRMAS.JFNM.nombre}`, 30, 255);
  // doc.text(`${actaData.FIRMAS.JFNM.cargo}`, 30, 260);
  // doc.text(`________________________`, 100, 250);
  // doc.text(`${actaData.FIRMAS.OJD.nombre}`, 100, 255);
  // doc.text(`${actaData.FIRMAS.OJD.cargo}`, 100, 260);

  // doc.addPage();
  // doc.setFontSize(16);
  // doc.setTextColor(18, 47, 117);
  // doc.text(`Número de Referencia: ${numeroRef}`, 5, 20);

  // doc.setFontSize(24);
  // doc.setTextColor(100);
  // doc.text(`Lugar del acta: ${lugar}`, 5, 40);

  // GUARDA EL PDF EN LA CARPETA TEMPORAL
  // doc.save(`src/temp/acta_ref_${numeroRef}.pdf`);

  // const rootPath = (refFile) => {
  //   return path.join(process.cwd(), `src/temp/acta_ref_${refFile}.pdf`);
  // };

  // Documentos de soporte
  let statMsg;

  async function folderExists(folderPath) {
    try {
      const stats = await fs.stat(folderPath);
      return stats.isDirectory();
    } catch (err) {
      if (err.code === "ENOENT") {
        return false; // La carpeta no existe
      }
      throw err; // Ocurrió un error diferente
    }
  }

  async function getActaFiles(ref) {
    const folderPath = path.join(
      process.cwd(),
      `src/uploads/actas/docs-soportes/soportes_ref_${ref}`
    );

    if (await folderExists(folderPath)) {
      statMsg = "Se envía el acta junto a sus documentos de soporte";
      return fs.readdir(folderPath).then((files) => {
        return files.map((file) => ({
          filename: file,
          path: path.join(folderPath, file),
        }));
      });
    } else {
      statMsg =
        "El acta no cuenta con documentos de soporte. Se envió el PDF generado en su lugar.";
      return [];
    }
  }

  const actaFiles = await getActaFiles(numeroRef);

  actaFiles.push({
    filename: `acta_ref_${numeroRef}.docx`,
    path: path.join(process.cwd(), `src/temp/acta_ref_${numeroRef}.docx`),
  });

  console.log(actaFiles);
  // console.log(actaFiles);

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
      <span style="color: #908890;font-size: 16px; font-weight: bold;">
      NOTA: Favor no responder a este mensaje, debido a que es un correo de divulgación, 
      cualquier inquietud o duda que tenga envíela al correo de la persona o departamento al que se hace mención.
      </span>

    <div style="background-color: #ffffff; padding: 20px;">
        <p style="color: #333;">Gracias por su atención.</p>
        <p style="color: #333;">Saludos cordiales, ${name}</p>
    </div>
  `,
    // DOCUMENTO ADJUNTO UBICADO EN root/src/temp/acta_ref_?.pdf y root/src/
    attachments: actaFiles,
  };

  try {
    Packer.toBuffer(doc).then((buffer) => {
      fss.writeFileSync(`src/temp/acta_ref_${numeroRef}.docx`, buffer);
    });

    transporter.sendMail(mailOptions, (err, info) => {
      err
        ? console.log(err)
        : console.log("Email enviado correctamente." + " " + statMsg);
    });

    // Actualizada la respuesta, añadiendo el estado de los documentos de soporte
    res.send({ message: "Enviado correctamente", stat: statMsg });
  } catch (e) {
    console.error(e);
  }
};
