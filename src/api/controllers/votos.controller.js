import OtrosVotos from "../../models/votos/Otrosvotos.js";
import VotoHomologacion from "../../models/votos/VotoHomo.js";
import VotoExpTituloAcademico from "../../models/votos/VotosExpTitulo.js";


// Otros Votos
export const getOtrosVotos = async (req, res) => {
  const foundOtrosVotos = await OtrosVotos.find();

  res.json(foundOtrosVotos);
};

// Voto homolagacion
export const getVotoExpTituloVotos = async (req, res) => {
  const foundExpTitulo = await VotoExpTituloAcademico.find();

  res.json(foundExpTitulo);
};
export const getHomoVotos = async (req, res) => {
  const foundHomologacion = await VotoHomologacion.find();

  res.json(foundHomologacion);
};
