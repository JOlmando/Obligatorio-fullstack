import express from 'express';

import { calcularCalorias } from '../controllers/calorias.controller.js';
import { calcularCaloriasSchema } from '../validators/calorias.validator.js';
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";

const router = express.Router();

router.post('/',validateBodyMiddleware(calcularCaloriasSchema), calcularCalorias);

export default router;

