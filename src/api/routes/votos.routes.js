import { Router } from 'express'
const router = Router()

import * as votosCtrl from '../controllers/votos.controller.js'

router
  .route("/")
  .get(votosCtrl.getOtrosVotos)
  .get(votosCtrl.getHomoVotos)
  .get(votosCtrl.getVotoExpTituloVotos);

export default router;