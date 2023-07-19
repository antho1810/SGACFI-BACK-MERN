import { Router } from "express";
const router = Router();

import * as mailsCtrl from "../controllers/mails.controller.js";
import * as auth from "../../middlewares/authJwt.js";

router
  .route("/send")
  .post([auth.checkAuth, auth.isSecretariaOrDecano], mailsCtrl.sendEMail);

router.route("/send-pdf").post(mailsCtrl.sendEmailPdf);

export default router;
