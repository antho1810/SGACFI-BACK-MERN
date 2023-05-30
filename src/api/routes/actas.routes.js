import { Router } from 'express';
const router = Router();

import * as actasCtrl from '../controllers/actas.controller.js';
import * as auth from '../../middlewares/authJwt.js';
// ACTAS ROUTES CRUD

router.get('/', [auth.checkAuth], actasCtrl.getActas);
router.get('/referencia/:numeroRef', [auth.checkAuth], actasCtrl.getActaByRef);

router.post(
  '/',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.createActas
);

router.put(
  '/referencia/:numeroRef',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.updateActaByRef
);

router.put(
  '/autorizacion/referencia/:numeroRef',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.updateStatusActa
);

router.delete(
  '/id/:id',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.deleteActaByRef
);

export default router;
