import express from "express";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { visitaIdParamSchema, crearVisitaSchema, modificarVisitaSchema } from "../validators/visitas.validators.js";

import { 
    crearVisita,
    obtenerVisitaPorId,
    obtenerVisitas,
    actualizarVisita,
    eliminarVisita } from "../controllers/visita.controllers.js";

const router = express.Router();

router.get("/", obtenerVisitas);
router.post("/", validateBodyMiddleware(crearVisitaSchema), crearVisita);
router.get("/:id", validateParamsMiddleware(visitaIdParamSchema), obtenerVisitaPorId);
router.patch("/:id", validateBodyMiddleware(modificarVisitaSchema), actualizarVisita);
router.delete("/:id", validateParamsMiddleware(visitaIdParamSchema), eliminarVisita);


export default router;