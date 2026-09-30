import express from "express";
import { verificarAdmin } from "../middlewares/authenticate.middleware.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { crearCategoriaSchema, categoriaIdParamSchema } from "../validators/categorias.validators.js";

import { 
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from "../controllers/categoria.controller.js";

const router = express.Router();

router.get("/", obtenerCategorias); 
router.post("/", verificarAdmin, validateBodyMiddleware(crearCategoriaSchema), crearCategoria);
router.patch("/:id", verificarAdmin, validateBodyMiddleware(crearCategoriaSchema), actualizarCategoria);
router.delete("/:id", verificarAdmin, validateParamsMiddleware(categoriaIdParamSchema), eliminarCategoria);


export default router;