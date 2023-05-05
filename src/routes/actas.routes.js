import { Router } from "express";
const router = Router();

import * as actasCtrl from "../../controllers/actas.controller.js";

// ACTAS ROUTES CRUD
router.get("/", actasCtrl.getActas),
  router.post("/", actasCtrl.createActas),
  router.put("/:id", actasCtrl.updateActas),
  router.delete("/:id", actasCtrl.deleteActas);

export default router;
