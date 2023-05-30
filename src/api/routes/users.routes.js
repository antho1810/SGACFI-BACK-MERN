import { Router } from 'express'
const router = Router()

import * as userCtrl from '../controllers/users.controllers.js'

import * as auth from '../../middlewares/authJwt.js'

router.get('/', auth.checkAuth, auth.isSecretariaOrDecano, userCtrl.getUsers)

export default router;