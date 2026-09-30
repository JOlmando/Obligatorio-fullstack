import express from "express";

import { 
    crearRutina
} from "../controllers/rutina.controller.js";

const router = express.Router();

router.post("/crear", crearRutina);

export default router;