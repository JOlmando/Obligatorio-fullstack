import express from "express";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { visitaIdParamSchema, crearVisitaSchema, modificarVisitaSchema } from "../validators/visitas.validators.js";

import { 
    crearVisita,
    obtenerVisitaPorId,
    obtenerVisitas,
    actualizarVisita,
    eliminarVisita } from "../controllers/visita.controllers.js";

const router = express.Router();

router.get("/", obtenerVisitas);
router.post("/", validateParamsMiddleware(crearVisitaSchema), crearVisita);
router.get("/:id", validateParamsMiddleware(visitaIdParamSchema), obtenerVisitaPorId);
router.patch("/:id", validateParamsMiddleware(modificarVisitaSchema), actualizarVisita);
router.delete("/:id", validateParamsMiddleware(visitaIdParamSchema), eliminarVisita);


export default router;