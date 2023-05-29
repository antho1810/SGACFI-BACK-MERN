import { Router } from "express";
const router = Router();

import * as participanteCtrl from "../controllers/participante.controller.js";
import * as auth from "../../middlewares/index.js";

router
  .route("/")
  .get([authJwt.checkAuth], participanteCtrl.getParticipantes)
  .post(
    [authJwt.checkAuth, authJwt.isSecretariaOrDecano],
    participanteCtrl.createParticipante
  );

router
  .route("/id/:id")
  .get([authJwt.checkAuth], participanteCtrl.getParticipantesById)
  .put(
    [authJwt.checkAuth, authJwt.isSecretariaOrDecano],
    participanteCtrl.updateParticipanteById
  )
  .delete(
    [authJwt.checkAuth, authJwt.isSecretariaOrDecano],
    participanteCtrl.deleteParticipanteById
  );

  export default router 