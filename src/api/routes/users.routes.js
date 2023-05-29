import { Router } from 'express'
const router = Router()

import * as userCtrl from '../controllers/users.controllers.js'

import * as auth from '../../middlewares/authJwt.js'

router.route("/", auth.checkAuth, auth.isSecretariaOrDecano, userCtrl.getUsers)
  // .get(userCtrl.getUsers)

export default router;