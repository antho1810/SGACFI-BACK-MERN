import { Router } from "express";
const router = Router();

import * as actasCtrl from "../controllers/actas.controller.js";
import { authJwt, checking } from "../../middlewares/index.js";

// ACTAS ROUTES CRUD

router.get("/", [authJwt.verifyToken], actasCtrl.getActas);
router.get("/id/:id", [authJwt.verifyToken], actasCtrl.getActasById);
router.post(
  "/",
  // Verificaciones post
  [
    authJwt.verifyToken,
    authJwt.isSecretariaOrDecano
  ],
  actasCtrl.createActas
);
router.put(
  "/id/:id",
  [authJwt.verifyToken, authJwt.isSecretaria],
  actasCtrl.updateActas
);

router.put(
  "/autorize/id/:id",
  // Cambiar el authJwt.isSecretariaOrDecano a authJwt.isDecano
  [authJwt.verifyToken, authJwt.isSecretariaOrDecano],
  actasCtrl.updateStatusActa
);
router.delete(
  "/id/:id",
  [authJwt.verifyToken, authJwt.isSecretaria],
  actasCtrl.deleteActas
);

export default router;