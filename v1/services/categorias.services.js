import Categoria from "../models/categoria.model.js";


export const obtenerCategoriasService = async (limit, page) => {
    limit = Number(limit) || 4;
    page = Number(page) || 1;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(await Categoria.countDocuments() / limit);
    const categorias = await Categoria.find().skip(skip).limit(limit);
    return {categorias, limit, page, totalPages};
};

export const actualizarCategoriaService = async (id, categoria) => {

    const categoriaActualizada = await Visita.findByIdAndUpdate(id, categoria, { returnDocument: "after" });
    return categoriaActualizada;

}

export const eliminarCategoriaService = async (id) => {

    const categoria = await Categoria.findById(id);
    if(categoria.enUso){
        const error = new Error("La categoria no se puede eliminar, tiene visitas asociadas.");
        error.status = 409;
        error.details = { categoria };
        throw error;
    }
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);
    return categoriaEliminada;

}