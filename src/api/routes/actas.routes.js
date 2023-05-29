import { Router } from "express";
const router = Router();

import * as actasCtrl from "../controllers/actas.controller.js";
import * as authJwt from "../../middlewares/index.js";

// ACTAS ROUTES CRUD

router.get("/",
  // [authJwt.verifyToken],
  [authJwt.checkAuth],
  actasCtrl.getActas);
router.get("/referencia/:numeroRef", [authJwt.checkAuth], actasCtrl.getActasById);
router.post(
  "/",
  // Verificaciones post
  [
    authJwt.checkAuth,
    authJwt.isSecretariaOrDecano
  ],
  actasCtrl.createActas
);
router.put(
  "/referencia/:numeroRef",
  [authJwt.checkAuth, authJwt.isSecretariaOrDecano],
  actasCtrl.updateActas
);

router.put(
  "/autorize/referencia/:numeroRef",
  // Cambiar el authJwt.isSecretariaOrDecano a authJwt.isDecano
  [authJwt.checkAuth, authJwt.isDecano],
  actasCtrl.updateStatusActa
);
router.delete(
  "/id/:id",
  [authJwt.checkAuth, authJwt.isSecretariaOrDecano],
  actasCtrl.deleteActas
);

export default router;
