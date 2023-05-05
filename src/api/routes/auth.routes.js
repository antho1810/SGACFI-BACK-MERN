import { Router } from 'express'
const router = Router()

import * as authCtrl from '../controllers/auth.controller.js'
import  {verifySignup} from '../../middlewares/index.js'

router.route("/registro").post([verifySignup.checkDuplicateEmailAndCedulaAndTelefono, verifySignup.checkRolesExisted],authCtrl.signUp)
router.route("/ingreso").post(authCtrl.signIn)

export default router;