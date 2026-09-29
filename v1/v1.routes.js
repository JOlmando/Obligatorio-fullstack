import express from 'express';
import authRouter from './routes/auth.routes.js';
import { authenticateMiddleware } from './middlewares/authenticate.middleware.js';
import visitasRouter from './routes/visitas.routes.js';
import categoriasRouter from './routes/categorias.routes.js';

const router = express.Router({mergeParams: true});

//Rutas públicas Login y Registro
router.use('/auth', authRouter);

//middleware para verificacion de token

router.use(authenticateMiddleware);

//Rutas protegidas
router.use("/visitas", visitasRouter); 
router.use('/categorias', categoriasRouter);

 export default router;