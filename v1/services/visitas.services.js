import Visita from "../models/visita.model.js";

export const obtenerVisitasService = async (limit, page) => {
    limit = Number(limit) || 3;
    page = Number(page) || 1;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(await Visita.countDocuments() / limit);
    const visitas = await Visita.find().skip(skip).limit(limit);
    return {visitas, limit, page, totalPages};
};

// Generar logica del alta de visita controlando el maximo de 4 por semana siempre que sea usuario plus
export const crearVisitaService = async (visitaData) => {
    const visitaBuscada = await Visita.findOne({ nombre: visitaData.nombre });
    if (visitaBuscada) {
        const error = new Error("La visita ya existe");
        error.status = 400;
        error.details = { visitaData };
        throw error;
    }
    const visita = new Visita(visitaData);
    await visita.save();
    return visita;
}


export const obtenerVisitaPorIdService = async (id) => {
    if(!mongoose.isValidObjectId(id)) {
        const errorIdInvalido = new Error('ID de visita no válido');
        errorIdInvalido.status = 400;
        errorIdInvalido.details = {id};
        throw errorIdInvalido;
    }
    const visita = await Visita.findById(id);
    return visita;
}

export const actualizarVisitaService = async (id, visita) => {
  
    const visitaActualizada = await Visita.findByIdAndUpdate(id, visita, { returnDocument: "after" });
    return visitaActualizada;
}

export const eliminarVisitaService = async (id) => {
    const inicioActividad = new Date(
        `${visita.fecha}T${visita.hora}:00-03:00`
    );

    const ahora = new Date();
    const diferenciaMs = inicioActividad - ahora;
    const doceHorasMs = 12 * 60 * 60 * 1000;

    if (diferenciaMs < doceHorasMs) {
        return res.status(400).json({
            mensaje: "No se puede cancelar la reserva con menos de 12 horas de anticipación"
        });
    }
    const visita = await Visita.findByIdAndDelete(id);
    return visita;
}

// export const obtenerVisitasFechasService = async (min, max) => {
//     const visitas = await Visita.find({ fechas: { $gte: min, $lte: max } });
//     return visitas;
// }