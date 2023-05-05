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
  [authJwt.verifyToken, authJwt.isSecretariaOrDecano, checking.checkModalidadExisted],
  actasCtrl.createActas
);
router.put(
  "/id/:id",
  [authJwt.verifyToken, authJwt.isSecretaria, checking.checkModalidadExisted],
  actasCtrl.updateActas
);
router.delete(
  "/id/:id",
  [authJwt.verifyToken, authJwt.isSecretaria],
  actasCtrl.deleteActas
);

export default router;
