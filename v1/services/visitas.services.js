import Visita from "../models/visita.model.js";
import Usuario from "../models/usuario.model.js";

export const obtenerVisitasService = async (limit, page) => {
    limit = Number(limit) || 3;
    page = Number(page) || 1;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(await Visita.countDocuments() / limit);
    const visitas = await Visita.find().skip(skip).limit(limit);
    return {visitas, limit, page, totalPages};
};

// Generar logica del alta de visita controlando el maximo de 4 por semana siempre que sea usuario plus
export const verificarLimiteSemanal = async (usuarioId, fecha) => {

    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    // Si es Premium, no tiene límite
    if (usuario.plan === "PREMIUM") {
        return true;
    }

    // Convertimos la fecha recibida a Date
    const fechaVisita = new Date(`${fecha}T00:00:00-03:00`);
    const diaSemana = fechaVisita.getDay();

    // Calculamos cuántos días hay que retroceder
    // para llegar al lunes
    const diasDesdeLunes = diaSemana === 0
        ? 6
        : diaSemana - 1;

    // Obtenemos el lunes de esa semana
    const inicioSemana = new Date(fechaVisita);

    inicioSemana.setDate(
        inicioSemana.getDate() - diasDesdeLunes
    );

    // El fin de la semana será el lunes siguiente
    const finSemana = new Date(inicioSemana);

    finSemana.setDate(
        finSemana.getDate() + 7
    );

    // Convertimos nuevamente a YYYY-MM-DD
    const fechaInicio = inicioSemana
        .toISOString()
        .slice(0, 10);

    const fechaFin = finSemana
        .toISOString()
        .slice(0, 10);

    // Contamos las visitas de ese usuario
    // entre lunes y domingo
    const cantidadVisitas = await Visita.countDocuments({
        usuarioId,
        fecha: {
            $gte: fechaInicio,
            $lt: fechaFin
        }
    });

    // Si tiene menos de 4, puede crear otra
    return cantidadVisitas < 4;
};


export const crearVisitaService = async (visitaData) => {

    const puedeCrear = await verificarLimiteSemanal(
        visitaData.usuarioId,
        visitaData.fecha
    );

    if (!puedeCrear) {

        const error = new Error(
            "El usuario alcanzó el límite de 4 visitas semanales del plan Plus"
        );

        error.statusCode = 403;
        error.code = "WEEKLY_LIMIT_REACHED";

        throw error;
    }


    const visita = new Visita(visitaData);

    await visita.save();

    return visita;
};


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
            status_code: 400,
            message: "No se puede cancelar la reserva con menos de 12 horas de anticipación"
        });
    }
    const visita = await Visita.findByIdAndDelete(id);
    return visita;
}

// export const obtenerVisitasFechasService = async (min, max) => {
//     const visitas = await Visita.find({ fechas: { $gte: min, $lte: max } });
//     return visitas;
// }