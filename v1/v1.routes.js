import express from 'express';
import authRouter from './routes/auth.routes.js';
import { authenticateMiddleware } from './middlewares/authenticate.middleware.js';
import visitasRouter from './routes/visitas.routes.js';



 const router = express.Router({mergeParams: true});

//Rutas públicas Login y Registro
router.use('/auth', authRouter);

//middleware para verificacion de token
router.use(authenticateMiddleware);
//Rutas protegidas
router.use("/visitas", visitasRouter); // Agregamos la ruta de productos


 export default router;