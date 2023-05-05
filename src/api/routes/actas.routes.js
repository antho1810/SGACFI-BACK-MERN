import { Router } from "express";
const router = Router();

import * as actasCtrl from "../controllers/actas.controller.js";
import { authJwt } from "../../middlewares/index.js";

// ACTAS ROUTES CRUD

router.get("/", actasCtrl.getActas);
router.post(
  "/",
  // Verificaciones post
  [authJwt.verifyToken, authJwt.isSecretaria, authJwt.isDecano],
  actasCtrl.createActas 
);
router.put("/id/:id", [authJwt.verifyToken, authJwt.isSecretaria], actasCtrl.updateActas);
router.delete("/id/:id", [authJwt.verifyToken, authJwt.isSecretaria], actasCtrl.deleteActas);

export default router;
