import { Router } from "express";
const router = Router();

import * as participanteCtrl from "../controllers/participante.controller.js";
import { authJwt } from "../../middlewares/index.js";

router
  .route("/")
  .get([authJwt.verifyToken], participanteCtrl.getParticipantes)
  .post(
    [authJwt.verifyToken, authJwt.isSecretariaOrDecano],
    participanteCtrl.createParticipante
  );

router
  .route("/id/:id")
  .get([authJwt.verifyToken], participanteCtrl.getParticipantesById)
  .put(
    [authJwt.verifyToken, authJwt.isSecretariaOrDecano],
    participanteCtrl.updateParticipanteById
  )
  .delete(
    [authJwt.verifyToken, authJwt.isSecretariaOrDecano],
    participanteCtrl.deleteParticipanteById
  );

  export default router 