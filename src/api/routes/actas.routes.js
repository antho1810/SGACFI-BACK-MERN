import { Router } from 'express';
const router = Router();

import Acta from '../../models/Acta.js';

import * as actasCtrl from '../controllers/actas.controller.js';
import * as auth from '../../middlewares/authJwt.js';

// SOPORT DOCUMENT
import multer from "multer";
import path from "path";
import fs from "fs";

// Obtener el último registro de la DB
const getLastRegister = async () => {
  try {
    const ultimoActa = await Acta.findOne().sort({ _id: -1 }).exec();
    const fixedRef = ultimoActa ? ultimoActa.numeroRef + 1 : 1;

    return fixedRef;
  } catch (e) {
    throw e;
  }
};

const mostrarUltimaReferencia = async () => {
  try {
    const referencia = await getLastRegister();
    return referencia;
  } catch (error) {
    throw error;
  }
};

const muestra = await mostrarUltimaReferencia();

setTimeout(() => console.log(muestra), 2000);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const referencia = await mostrarUltimaReferencia();
      const folderPath = path.join(
        process.cwd(),
        "src/uploads/actas/docs-soportes",
        `soportes_ref_${referencia}`
      );
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      cb(null, folderPath);
    } catch (error) {
      console.error("Error al obtener última referencia:", error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { ref } = req.params;
      const folderPath = path.join(
        process.cwd(),
        "src/uploads/actas/docs-soportes",
        `soportes_ref_${ref}`
      );
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      cb(null, folderPath);
      console.log(req.params);
    } catch (error) {
      console.error("Error al obtener última referencia:", error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const update = multer({ storage: uploadStorage });


// DONWLOAD PDF
router.get('/descargar/referencia/:numeroRef', [auth.checkAuth, auth.isSecretariaOrDecano], actasCtrl.sendActa);

// ACTAS ROUTES CRUD
router.get('/', [auth.checkAuth], actasCtrl.getActas);
router.get('/referencia/:numeroRef', [auth.checkAuth], actasCtrl.getActaByRef);

router.post(
  '/',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.createActas
);

router.post(
  "/carga",
  [auth.checkAuth, upload.array("soportes")],
  (req, res) => {
    res.status(200).json({ message: "Archivos cargados exitosamente" });
  }
);

router.post(
  "/carga/actualizar/referencia/:ref",
  [auth.checkAuth, update.array("updateSoportes")],
  (req, res) => {
    res.status(200).json({ message: "Archivos cargados exitosamente" });
  }
);

router.put(
  '/referencia/:numeroRef',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.updateActaByRef
);

router.put(
  '/autorizacion/referencia/:numeroRef',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.updateStatusActa
);

router.delete(
  '/id/:id',
  [auth.checkAuth, auth.isSecretariaOrDecano],
  actasCtrl.deleteActaByRef
);

export default router;
