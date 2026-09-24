import express from 'express';
import authRouter from './routes/auth.routes.js';
import { authenticateMiddleware } from './middlewares/authenticate.middleware.js';
import productosRouter from './routes/productos.routes.js';
import dragonesRouter from './routes/dragones.routes.js';
import tesorosRouter from './routes/tesoros.routes.js';

import climaRouter from './routes/clima.routes.js';


 const router = express.Router({mergeParams: true});

//Rutas públicas Login y Registro
router.use('/auth', authRouter);
router.use("/productos", productosRouter); // Agregamos la ruta de productos
router.use("/dragones", dragonesRouter);
router.use("/tesoros", tesorosRouter);

router.use("/clima", climaRouter);

//middleware para verificacion de token
router.use(authenticateMiddleware);
//Rutas protegidas



 export default router;