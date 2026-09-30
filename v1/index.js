import express from 'express';
import visitasRoutes from './routes/visitas.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';

const router = express.Router();

router.use('/visitas', visitasRoutes);

export default router;
