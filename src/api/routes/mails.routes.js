import { Router } from "express";
const router = Router();

import * as mailsCtrl from "../controllers/mails.controller.js";
import * as auth from "../../middlewares/authJwt.js";

router.route("/send-pdf").post([auth.checkAuth, auth.isSecretariaOrDecano], mailsCtrl.sendEmailPdf);

export default router;
