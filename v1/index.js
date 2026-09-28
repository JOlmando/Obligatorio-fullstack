import express from 'express';
import visitasRoutes from './routes/visitas.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';

const router = express.Router();

router.use('/visitas', visitasRoutes);
router.use('/categorias', categoriasRoutes);

export default router;
