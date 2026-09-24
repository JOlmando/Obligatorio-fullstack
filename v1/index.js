import express from 'express';
import peliculasRoutes from './routes/peliculas.routes.js';

const router = express.Router();

router.use('/peliculas', peliculasRoutes);

export default router;
