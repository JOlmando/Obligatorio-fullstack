import Categoria from "../models/categoria.model.js";


export const obtenerCategoriasService = async (limit, page) => {
    limit = Number(limit) || 3;
    page = Number(page) || 1;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(await Categoria.countDocuments() / limit);
    const categorias = await Categoria.find().skip(skip).limit(limit);
    return {categorias, limit, page, totalPages};
};