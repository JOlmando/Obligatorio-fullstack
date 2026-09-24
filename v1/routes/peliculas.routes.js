import express from 'express';
import { obtenerPeliculas } from '../controllers/peliculas.controller.js';
const router = express.Router({ mergeParams: true });

router.get('/', obtenerPeliculas);

export default router;