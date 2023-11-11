import { Router } from 'express';
const router = Router();

import * as participanteCtrl from '../controllers/participante.controller.js';
import * as auth from '../../middlewares/authJwt.js';

router
  .route('/')
  .get([auth.checkAuth], participanteCtrl.getParticipantes)
  .post(
    [auth.checkAuth, auth.isSecretariaOrDecano],
    participanteCtrl.createParticipante
  );

router
  .route('/id/:id')
  .get([auth.checkAuth], participanteCtrl.getParticipanteById)
  .put(
    [auth.checkAuth, auth.isSecretariaOrDecano],
    participanteCtrl.updateParticipanteById
  )
  .delete(
    [auth.checkAuth, auth.isSecretariaOrDecano],
    participanteCtrl.deleteParticipanteById
  );

export default router;
