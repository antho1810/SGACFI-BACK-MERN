import { Router } from "express";
const router = Router();

import *  as userCtrl from '../controllers/users.controller.js'

router.route("/").get(userCtrl.getUsers);

export default router;
