import Acta from '../../models/Acta.js';
import path from "path";
import * as fs from "fs";
import actaData from "../../libs/acta.js";
import moment from "moment";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  PageNumber,
  Header,
  Footer,
  TextRun,
  BorderStyle,
  Media,
  ImageRun,
  Tab,
  VerticalAlign, 
  TextDirection
} from "docx"

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
          text: `Artículos # ${obj.titulo}_${obj.nombreAspirante}`,
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
    // console.log(VotosAutoriza);

    let fixDocVotosAutoriza = [];
    for (let i = 0; i < VotosAutoriza.length; i++) {
      for (let j = 0; j < VotosAutoriza[i].length; j++) {
        fixDocVotosAutoriza.push(VotosAutoriza[i][j]);
      }
    }

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
    // console.dir(objetosAgrupados);

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
          text: `Artículos # ${obj.titulo}_${obj.nombreAspirante}`,
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
            // ...parrafosArticulos.flat(),
            // parrafosArticulos.flat().forEach(parrafo => addParagraph(parrafo)),
          ],
        },
        // {
        //   properties: {
        //     type: "continuous",
        //   },
        //   children: parrafosArticulos,
        // },
        {
          properties: {
            type: "continuous",
          },
          children: fixDocVotosTemp,
        },
        {
          properties: {
            type: "continuous",
          },
          children: fixDocVotosAutoriza,
        },
      ],
    });

    // const buffer = await Packer.toBuffer(doc);

    // Establecer las cabeceras de la respuesta para el DOCX
    // res.setHeader("Content-Disposition", `attachment; filename=archivo.docx`);

    // // Enviar el DOCX como respuesta
    // res.send(buffer);

    let fileName = `acta_ref_${numeroRef}`;
    let filePath = path.join(
      process.cwd(),
      `src/temp/acta_ref_${numeroRef}.docx`
    );
    let stat = fileSystem.statSync(filePath);

     Packer.toBuffer(doc).then((buffer) => {
       fss.writeFileSync(`src/temp/acta_ref_${numeroRef}.docx`, buffer);
     });

    response.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${fileName}.docx`,
      "Content-Length": stat.size,
    });

    var readStream = fileSystem.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(response);
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
