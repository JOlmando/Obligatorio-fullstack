import Visita from "../models/visita.model.js";
import Usuario from "../models/usuario.model.js";
import Categoria from "../models/categoria.model.js";
import mongoose from "mongoose";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const obtenerVisitasService = async (limit, page, usuarioId) => {
    limit = Number(limit) || 3;
    page = Number(page) || 1;
    const skip = (page - 1) * limit;

    const usuarioObjectId = new mongoose.Types.ObjectId(usuarioId);

    const totalPages = Math.ceil(
        await Visita.countDocuments({ usuarioId: usuarioObjectId }) / limit
    );
    
    const visitas = await Visita.find({ usuarioId: usuarioObjectId })
        .skip(skip)
        .limit(limit);
    

    return { visitas, limit, page, totalPages };
};

// Generar logica del alta de visita controlando el maximo de 4 por semana siempre que sea usuario plus
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const verificarLimiteSemanal = async (
    usuarioId,
    fecha,
    visitaId = null
) => {

    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    if (usuario.plan === "PREMIUM") {
        return true;
    }

    const fechaVisita = new Date(
        `${fecha}T00:00:00-03:00`
    );

    const diaSemana = fechaVisita.getDay();

    const diasDesdeLunes = diaSemana === 0
        ? 6
        : diaSemana - 1;

    const inicioSemana = new Date(fechaVisita);

    inicioSemana.setDate(
        inicioSemana.getDate() - diasDesdeLunes
    );

    const finSemana = new Date(inicioSemana);

    finSemana.setDate(
        finSemana.getDate() + 7
    );

    const fechaInicio = inicioSemana
        .toISOString()
        .slice(0, 10);

    const fechaFin = finSemana
        .toISOString()
        .slice(0, 10);

    const filtro = {
        usuarioId,
        fecha: {
            $gte: fechaInicio,
            $lt: fechaFin
        }
    };

    // Si estamos actualizando una visita,
    // no contamos esa misma visita.
    if (visitaId) {
        filtro._id = {
            $ne: visitaId
        };
    }

    const cantidadVisitas = await Visita.countDocuments(filtro);

    return cantidadVisitas < 4;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const verificarHorarioVisita = async (
    categoria,
    fecha,
    hora
) => {

    const horarios = categoria.horarios.split(";");

    // SALA DE MUSCULACIÓN
    // El usuario hace check-in en el momento.
    if (categoria.nombre === "Sala de musculación") {

        const ahora = new Date();

        const horaActual = ahora.toLocaleTimeString("es-UY", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Montevideo"
        });

        const horarioValido = horarios.some((horario) => {

            const [horaInicio, horaFin] = horario.split("-");

            return horaActual >= horaInicio && horaActual < horaFin;
        });

        if (!horarioValido) {
            const error = new Error(
                "La sala de musculación se encuentra fuera de horario"
            );

            error.statusCode = 400;
            error.code = "GYM_CLOSED";

            throw error;
        }

        return;
    }

    // FUNCIONAL / CALISTENIA / CROSSFIT
    // La hora debe coincidir exactamente con
    // uno de los bloques definidos en la categoría.

    const horarioValido = horarios.includes(hora);

    if (!horarioValido) {
        const error = new Error(
            `El horario seleccionado no está disponible para esta actividad: ${categoria.nombre}`
        );

        error.statusCode = 400;
        error.code = "INVALID_SCHEDULE";

        throw error;
    }

    // Tomamos solamente la hora de inicio.
    // Ejemplo:
    // "10:00-11:15" -> "10:00"
    const [horaInicio] = hora.split("-");

    const inicioActividad = new Date(
        `${fecha}T${horaInicio}:00-03:00`
    );

    const ahora = new Date();

    const doceHoras = 12 * 60 * 60 * 1000;

    // La reserva debe hacerse con al menos
    // 12 horas de anticipación.
    if (inicioActividad - ahora < doceHoras) {

        const error = new Error(
            "La reserva debe realizarse con al menos 12 horas de anticipación"
        );

        error.statusCode = 400;
        error.code = "LESS_THAN_12_HOURS";

        throw error;
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const crearVisitaService = async (visitaData) => {

    const categoria = await Categoria.findById(
        visitaData.categoriaId
    );

    if (!categoria) {
        const error = new Error("Categoría no encontrada");

        error.statusCode = 404;
        error.code = "CATEGORY_NOT_FOUND";

        throw error;
    }

    // Si es musculación, la fecha y hora
    // salen del momento actual.
    if (categoria.nombre === "Sala de musculación") {

        const ahora = new Date();

        visitaData.fecha = ahora.toLocaleDateString(
            "en-CA",
            { timeZone: "America/Montevideo" }
        );

        visitaData.hora = ahora.toLocaleTimeString(
            "es-UY",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "America/Montevideo"
            }
        );
    }

    await verificarHorarioVisita(
        categoria,
        visitaData.fecha,
        visitaData.hora
    );

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const obtenerVisitaByIdUserService = async (id) => {
    if(!mongoose.isValidObjectId(id)) {
        const errorIdInvalido = new Error('ID de visita no válido');
        errorIdInvalido.status = 400;
        errorIdInvalido.details = {id};
        throw errorIdInvalido;
    }
    const visita = await Visita.findById(id);
    return visita;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const actualizarVisitaService = async (
    visitaId,
    usuarioId,
    nuevosDatos
) => {

    const visita = await Visita.findOne({
        _id: visitaId,
        usuarioId
    });



    if (!visita) {
        const error = new Error("Visita no encontrada");

        error.statusCode = 404;
        error.code = "VISIT_NOT_FOUND";

        throw error;
    }


    const categoria = await Categoria.findById(
        nuevosDatos.categoriaId
    );



    if (!categoria) {
        const error = new Error("Categoría no encontrada");

        error.statusCode = 404;
        error.code = "CATEGORY_NOT_FOUND";

        throw error;
    }

    const categoriaActual = await Categoria.findById(visita.categoriaId);

    const nombereCategoriaActual = categoriaActual.nombre;

    const nombereCategoriaNueva = categoria.nombre;

    console.log("nombereCategoriaActual:", nombereCategoriaActual);

    console.log("nombereCategoriaNueva:", nombereCategoriaNueva);

    if (nombereCategoriaActual === "Sala de musculación" || nombereCategoriaNueva === "Sala de musculación") {
        const error = new Error(
            "No se puede cambiar el check-in de la Sala de musculación o cambiar a la Sala de musculación"
        );

        error.statusCode = 400;
        error.code = "INVALID_CATEGORY_CHANGE";

    throw error;
}

    await verificarHorarioVisita(
        categoria,
        nuevosDatos.fecha,
        nuevosDatos.hora
    );

    const puedeActualizar = await verificarLimiteSemanal(
        usuarioId,
        nuevosDatos.fecha,
        visitaId
    );

    if (!puedeActualizar) {

        const error = new Error(
            "El usuario alcanzó el límite de 4 visitas semanales del plan Plus"
        );

        error.statusCode = 403;
        error.code = "WEEKLY_LIMIT_REACHED";

        throw error;
    }

    visita.categoriaId = nuevosDatos.categoriaId;
    visita.fecha = nuevosDatos.fecha;
    visita.hora = nuevosDatos.hora;

    await visita.save();

    return visita;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const eliminarVisitaService = async (
    visitaId,
    usuarioId
) => {

    const visita = await Visita.findOne({
        _id: visitaId,
        usuarioId
    });

    if (!visita) {
        const error = new Error("Visita no encontrada");

        error.statusCode = 404;
        error.code = "VISIT_NOT_FOUND";

        throw error;
    }

    const categoria = await Categoria.findById(
        visita.categoriaId
    );

    if (!categoria) {
        const error = new Error("Categoría no encontrada");

        error.statusCode = 404;
        error.code = "CATEGORY_NOT_FOUND";

        throw error;
    }

    // Musculación es un check-in que ya ocurrió.
    if (categoria.nombre === "Sala de musculación") {
        const error = new Error(
            "No se puede eliminar un check-in de la Sala de musculación, ya que es un registro de asistencia"
        );
        error.statusCode = 403;
        error.code = "CHECK_IN_CANNOT_BE_CANCELLED";

        throw error;
    }

    // Las 12 horas aplican a las reservas de actividades.
    if (categoria.nombre !== "Sala de musculación") {

        const [horaInicio] = visita.hora.split("-");

        const inicioActividad = new Date(
            `${visita.fecha}T${horaInicio}:00-03:00`
        );

        const ahora = new Date();

        const doceHoras = 12 * 60 * 60 * 1000;

        if (inicioActividad - ahora < doceHoras) {

            const error = new Error(
                "No se puede cancelar la reserva con menos de 12 horas de anticipación"
            );

            error.statusCode = 400;
            error.code = "LESS_THAN_12_HOURS";

            throw error;
        }
    }

    await visita.deleteOne();

    return visita;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const obtenerVisitasFechasService = async (min, max) => {

    const visitas = await Visita.find({
        fecha: {
            $gte: min,
            $lte: max
        }
    });
    return visitas;
};