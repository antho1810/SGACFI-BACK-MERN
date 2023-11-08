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
            articulo.titulo ===
            "Autorización de expedición de títulos académicos"
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
        type: WidthType.PERCENTAGE,
      },
      alignment: AlignmentType.CENTER,
    });
    const tableAusent = new Table({
      rows: fixedRowsAusent,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      alignment: AlignmentType.CENTER,
    });
    const tableInvit = new Table({
      rows: fixedRowsInvit,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      alignment: AlignmentType.CENTER,
    });
    const tableHomologa = new Table({
      rows: fixedRowsHomologa,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      alignment: AlignmentType.CENTER,
    });

    const tableAutoriza = new Table({
      rows: fixedRowsAutoriza,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      alignment: AlignmentType.CENTER,
    });

    const firma = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
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
                text: `Aprobar la solicitud de ${voto.titulo} del estudiante ${voto.nombreAspirante}, identificado con ${voto.tipoDocumento} número ${voto.noDocumento}. ${voto.observacion}. Aprobado por ${voto.Aprobacion}.`,
                alignment: AlignmentType.JUSTIFIED,
              }),
            ],
          }),
        ];

        // Condicionales para agregar tablas adicionales según el título del artículo
        if (voto.titulo === "Homologación Interna" || voto.titulo === "Homologación Externa") {
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
              style: {
                paragraph: {
                  color: "000000",
                },
              },
            }),
            // table,
            tablePresent,
            new Paragraph({
              text: "MIEMBROS AUSENTES",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              style: {
                paragraph: {
                  color: "000000",
                },
              },
            }),
            // table,
            tableAusent,
            new Paragraph({
              text: "MIEMBROS INVITADOS",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              style: {
                paragraph: {
                  color: "000000",
                },
              },
            }),
            tableInvit,
            new Paragraph({
              text: "DESARROLLO DEL ORDEN DEL DIA",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
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
              style: {
                paragraph: {
                  color: "000000",
                },
              },
            }),
            ...parrafosArticulos.flat(),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Establecer las cabeceras de la respuesta para el DOCX
    res.setHeader("Content-Disposition", `attachment; filename=archivo.docx`);

    // Enviar el DOCX como respuesta
    res.send(buffer);
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
