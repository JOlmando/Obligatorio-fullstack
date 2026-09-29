import { 
    obtenerCategoriasService,
    actualizarCategoriaService,
    eliminarCategoriaService,
    actualizarEnUsoCategoriaServices
} from "../services/categorias.services.js";

export const obtenerCategorias = async (req, res) => {
    const { limit, page } = req.query;
    const categorias = await obtenerCategoriasService(limit, page);
    res.json(categorias);
}

export const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const categoria = await actualizarCategoriaService(id, req.body);
    
    res.json(categoria);
}

export const eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    const categoria = await eliminarCategoriaService(id);
    
    res.json(categoria);
}

export const actualizarEnUsoCategoria= async (req, res) => {
    const { id } = req.params;
    const categoria = await actualizarEnUsoCategoriaServices(id);
    res.json(categoria);
}