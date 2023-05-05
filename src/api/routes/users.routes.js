import { Router } from 'express'
const router = Router()

import * as userCtrl from '../controllers/users.controllers.js'

router.route("/").get(userCtrl.getUsers)

export default router;