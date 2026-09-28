import express from "express";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { visitaIdParamSchema, crearVisitaSchema, modificarVisitaSchema } from "../validators/visitas.validators.js";

import { 
    obtenerCategorias
} from "../controllers/categoria.controller.js";

const router = express.Router();

router.get("/", obtenerCategorias);
// router.post("/", validateParamsMiddleware(crearCategoriaSchema), crearCategoria);
// router.get("/:id", validateParamsMiddleware(categoriaIdParamSchema), obtenerCategoriaPorId);
// router.patch("/:id", validateParamsMiddleware(modificarCategoriaSchema), actualizarCategoria);
// router.delete("/:id", validateParamsMiddleware(categoriaIdParamSchema), eliminarCategoria);


export default router;