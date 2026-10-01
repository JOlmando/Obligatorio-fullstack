import express from "express";
import {obtenerAlimentos} from "../controllers/nutricion.controller.js";
import { validateQueryMiddleware } from "../middlewares/validateQuery.middleware.js";
import { comidaSchema } from "../validators/nutricion.validators.js";

const router = express.Router();

router.get("/",validateQueryMiddleware(comidaSchema), obtenerAlimentos);

export default router;