import Categoria from "../models/categoria.model.js";
import Visita from "../models/visita.model.js";

export const obtenerCategoriasService = async (limit, page) => {
    limit = Number(limit) || 4;
    page = Number(page) || 1;

    const skip = (page - 1) * limit;

    const total = await Categoria.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const categorias = await Categoria
        .find()
        .skip(skip)
        .limit(limit);

    return {
        categorias,
        limit,
        page,
        totalPages
    };
};

export const actualizarCategoriaService = async (id, categoria) => {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
        id,
        categoria,
        {
            new: true,
            runValidators: true
        }
    );

    if (!categoriaActualizada) {
        const error = new Error("Categoría no encontrada");
        error.status = 404;
        throw error;
    }

    return categoriaActualizada;
};

export const eliminarCategoriaService = async (id) => {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
        const error = new Error("Categoría no encontrada");
        error.status = 404;
        throw error;
    }

    if (categoria.enUso) {
        const error = new Error(
            "La categoría no se puede eliminar, tiene visitas asociadas."
        );

        error.status = 409;
        error.details = { categoria };

        throw error;
    }

    const categoriaEliminada = await Categoria.findByIdAndDelete(id);

    return categoriaEliminada;
};

export const actualizarEnUsoCategoriaServices = async (categoriaId) => {
    const existeVisita = await Visita.exists({
        categoriaId
    });

    const categoria = await Categoria.findByIdAndUpdate(
        categoriaId,
        {
            enUso: !!existeVisita
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!categoria) {
        const error = new Error("Categoría no encontrada");
        error.status = 404;
        throw error;
    }

    return categoria;
};

