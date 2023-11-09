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

  const votosAutori = articulos
    .filter((articulo) => {
      return (
        articulo["titulo"] ===
        "Autorización de expedición de títulos académicos"
      );
    })
    .reduce((acumulador, articulo) => {
      const {
        nombreAspirante,
        titulo,
        tipoDocumento,
        noDocumento,
        Aprobacion,
        observacion,
      } = articulo;
      const objetoExistente = acumulador.find(
        (item) => item.nombreAspirante === nombreAspirante
      );

      if (objetoExistente) {
        objetoExistente.datos.push(articulo);
      } else {
        acumulador.push({
          nombreAspirante: nombreAspirante,
          titulo: titulo,
          tipoDocumento: tipoDocumento,
          noDocumento: noDocumento,
          Aprobacion: Aprobacion,
          observacion: observacion,
          datos: [articulo],
        });
      }

      return acumulador;
    }, []);
  console.dir(votosAutori);

  // Autorizacion
  const VotosAutoriza = votosAutori.map((obj, index) => {
    let autoRows = obj.datos.map((articulo, index) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: (index + 1).toString(),
              }),
            ],
          }),
          // ENCABEZADO PARA NOTA FINAL
          new TableCell({
            children: [
              new Paragraph({
                text: articulo.nombreAspirante,
              }),
            ],
          }),
          // ENCABEZADO PARA MATERIA EQUIVALENTE
          new TableCell({
            children: [
              new Paragraph({
                text: articulo.tipoDocumento,
              }),
            ],
          }),
          // ENCABEZADO PARA CREDITOS
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
    return [
      new Paragraph({
        text: `Artículos ${(index + 1).toString()} ${obj.titulo}_${
          obj.nombreAspirante
        }`,
        style: "Strong",
        spacing: {
          before: 200,
          after: 50,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Aprobar la solicitud de ${obj.titulo} del estudiante ${obj.nombreAspirante}, identificado con ${obj.tipoDocumento} número ${obj.noDocumento}. ${obj.observacion}. Aprobado por ${obj.Aprobacion}`,
            alignment: AlignmentType.JUSTIFIED,
          }),
        ],
      }),
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: "N°",
                    style: "Strong",
                  }),
                ],
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    text: "Nombre del aspirante",
                    style: "Strong",
                  }),
                ],
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    text: "Tipo de documento",
                    style: "Strong",
                  }),
                ],
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    text: "N° de documento",
                    style: "Strong",
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Programa profesional",
                    style: "Strong",
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Código SNIES",
                    style: "Strong",
                  }),
                ],
              }),
            ],
          }),
        ].concat(autoRows),
        width: {
          size: 100,
          type: "pct",
        },
      }),
    ];
  });

  console.log(VotosAutoriza);

  const objetosAgrupados = articulos
    .filter((match) => {
      return (
        match["titulo"] === "Homologación Interna" ||
        match["titulo"] === "Homologación Externa"
      );
    })
    .reduce((acumulador, articulo) => {
      const {
        nombreAspirante,
        titulo,
        tipoDocumento,
        noDocumento,
        Aprobacion,
        observacion,
      } = articulo;
      const objetoExistente = acumulador.find(
        (item) => item.nombreAspirante === nombreAspirante
      );

      if (objetoExistente) {
        objetoExistente.datos.push(articulo);
      } else {
        acumulador.push({
          nombreAspirante: nombreAspirante,
          titulo: titulo,
          tipoDocumento: tipoDocumento,
          noDocumento: noDocumento,
          Aprobacion: Aprobacion,
          observacion: observacion,
          datos: [articulo],
        });
      }

      return acumulador;
    }, []);
  console.dir(objetosAgrupados);

  // Homologacion
  const generateVotosTable = objetosAgrupados.map((obj, index) => {
    let autoRows = obj.datos.map((articulo) => {
      return new TableRow({
        children: [
          // ENCABEZADO PARA MATERIA APROBADA
          new TableCell({
            children: [
              new Paragraph({
                text: articulo.materiaAprobada,
              }),
            ],
          }),
          // ENCABEZADO PARA NOTA FINAL
          new TableCell({
            children: [
              new Paragraph({
                text: articulo.notaCalificacion,
              }),
            ],
          }),
          // ENCABEZADO PARA MATERIA EQUIVALENTE
          new TableCell({
            children: [
              new Paragraph({
                text: articulo.materiaEquivalente,
              }),
            ],
          }),
          // ENCABEZADO PARA CREDITOS
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
    return [
      new Paragraph({
        text: `Artículos ${(index + 1).toString()} ${obj.titulo}_${
          obj.nombreAspirante
        }`,
        style: "Strong",
        spacing: {
          before: 200,
          after: 50,
        },
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: `Aprobar la solicitud de ${obj.titulo} del estudiante ${obj.nombreAspirante}, identificado con ${obj.tipoDocumento} número ${obj.noDocumento}. ${obj.observacion}. Aprobado por ${obj.Aprobacion}`,
            alignment: AlignmentType.JUSTIFIED,
          }),
        ],
      }),
      new Table({
        rows: [
          new TableRow({
            children: [
              // ENCABEZADO PARA MATERIA APROBADA
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Materia Aprobada",
                    style: "Strong",
                  }),
                ],
              }),
              // ENCABEZADO PARA NOTA FINAL
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Nota Final",
                    style: "Strong",
                  }),
                ],
              }),
              // ENCABEZADO PARA MATERIA EQUIVALENTE
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Materia Equivalente",
                    style: "Strong",
                  }),
                ],
              }),
              // ENCABEZADO PARA CREDITOS
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Créditos",
                    style: "Strong",
                  }),
                ],
              }),
            ],
          }),
        ].concat(autoRows),
        width: {
          size: 100,
          type: "pct",
        },
      }),
    ];
  });

  
  let fixDocVotosTemp = [];

  for (let i = 0; i < generateVotosTable.length; i++) {
    for (let j = 0; j < generateVotosTable[i].length; j++) {
      fixDocVotosTemp.push(generateVotosTable[i][j]);
    }
  }

  let fixDocVotosAutoriza = [];

  for (let i = 0; i < VotosAutoriza.length; i++) {
    for (let j = 0; j < VotosAutoriza[i].length; j++) {
      fixDocVotosAutoriza.push(VotosAutoriza[i][j]);
    }
  }
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

  let autoRowsPresent = createMembersArrayForTablePresent();
  let autoRowsAusent = createMembersArrayForTableAusent();
  let autoRowsInvit = createMembersArrayForTableInvit();

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

      if (
        voto.titulo !== "Homologación Interna" &&
        voto.titulo !== "Homologación Externa" &&
        voto.titulo !== "Autorización de expedición de títulos académicos"
      ) {
        // Agregar lógica específica para otros tipos de votos si es necesario
        const parrafos = [
          new Paragraph({
            children: [
              new TextRun({
                text: `Artículos # ${voto.titulo}_${voto.nombreAspirante}`,
                style: "Strong",
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
      }
    }
  });
  

  console.log(parrafosArticulos);
  const lugarTexto =
    lugar === "LDS"
      ? "Labor0atorio de sistemas (LDS)"
      : lugar === "LADSIF"
      ? "Laboratorio de análisis de datos e investigación (LADSIF)"
      : lugar === "LMF"
      ? "Laboratorio Múltiple de Física (LMF)"
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
          tablePresent,
          new Paragraph({
            text: "MIEMBROS AUSENTES",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            style: "Strong",
          }),
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
            style: "Strong",
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
            style: "Strong",
          }),
          ...parrafosArticulos.flat(),
        ],
      },
      {
        properties: {
          type: "continuous",
        },
        children: fixDocVotosTemp
      },
      {
        properties: {
          type: "continuous",
        },
        children: fixDocVotosAutoriza,
      },
    ],
  });

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
      <h3>Correo enviado desde nodemailer para ${to}</h3>
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
