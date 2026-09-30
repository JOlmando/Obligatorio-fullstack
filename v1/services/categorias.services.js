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

export const crearCategoriaService = async (nombre, horarios, enUso = false) => {
    try {
        const categoria = await Categoria.create({ nombre, horarios, enUso });
        return categoria;
    } catch (error) {
        if (error.code === 11000) {
            const nuevoError = new Error("La categoría ya existe");
            nuevoError.status_code = 409;
            throw nuevoError;
        }
        throw error;
    }
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

    const existeVisita = await Visita.exists({
        categoriaId: id
    });

    if (existeVisita) {
        const error = new Error(
            "La categoría no se puede eliminar, tiene visitas asociadas."
        );

        error.status = 409;
        throw error;
    }

    const categoriaEliminada = await Categoria.findByIdAndDelete(id);

    return categoriaEliminada;
};

export const actualizarEnUsoCategoriaService = async (categoriaId) => {
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

