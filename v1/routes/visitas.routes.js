import express from "express";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { tesoroIdParamSchema } from "../validators/tesoros.validators.js";

import { 
    crearVisita,
    obtenerVisitaId,
    obtenerVisitas,
    actualizarVisita,
    eliminarVisita } from "../controllers/visita.controller.js";

const router = express.Router();

router.get("/", validateParamsMiddleware(), obtenerVisitas);
router.post("/", crearVisita);
router.get("/:id", obtenerVisitaId);
router.patch("/:id", actualizarVisita);
router.delete("/:id", eliminarVisita);


export default router;