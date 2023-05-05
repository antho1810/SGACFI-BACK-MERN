import { Router } from "express";
const router = Router();

import * as authCtrl from "../../controllers/auth.controller.js";

router.route("/registro").post(authCtrl.signUp);
router.route("/ingreso").post(authCtrl.signIn);

export default router;
