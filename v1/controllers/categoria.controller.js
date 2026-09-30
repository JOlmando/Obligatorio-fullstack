import { 
    obtenerCategoriasService,
    actualizarCategoriaService,
    eliminarCategoriaService,
    actualizarEnUsoCategoriaService,
    crearCategoriaService
} from "../services/categorias.services.js";

export const obtenerCategorias = async (req, res) => {
    const { limit, page } = req.query;
    const categorias = await obtenerCategoriasService(limit, page);
    res.status(200).json(categorias);
}

export const crearCategoria = async (req, res) => {
    const { nombre, horarios, enUso } = req.body;
    
    const categoria = await crearCategoriaService(
        nombre,      
        horarios,
        enUso
    );
    res.status(201).json(categoria);
};

export const actualizarCategoria = async (req, res) => {

    const { id } = req.params;

    const categoria = await actualizarCategoriaService(
        id,
        req.body
    );
    res.status(200).json(categoria);
};

export const eliminarCategoria = async (req, res) => {

    const { id } = req.params;

    const categoria = await eliminarCategoriaService(id);

    res.status(200).json(categoria);
};

export const actualizarEnUsoCategoria= async (req, res) => {
    const { id } = req.params;
    const categoria = await actualizarEnUsoCategoriaService(id);
    res.status(200).json(categoria);
}