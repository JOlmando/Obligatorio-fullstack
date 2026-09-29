import { 
    crearVisitaService, 
    obtenerVisitasFechasService,
    obtenerVisitasService,
    actualizarVisitaService,
    eliminarVisitaService, } from "../services/visitas.services.js";

import {actualizarEnUsoCategoriaService} from "../services/categorias.services.js"

export const obtenerVisitas = async (req, res) => {
    // const { limit, page } = req.query;
    // const usuarioId = req.decoded._id;
    // const resultado = await obtenerVisitasService(limit, page, usuarioId);
    // res.json(resultado);
}

// Generar logica de visitas
export const crearVisita = async (req, res) => {
    const { categoriaId, fecha, hora } = req.body;
    const usuarioId = req.user._id; // Obtener el ID del usuario desde el token de autenticación
    const visita = await crearVisitaService({
        usuarioId,
        categoriaId,
        fecha,
        hora
    });
    await actualizarEnUsoCategoriaService(categoriaId);
    res.status(201).json(visita);
};

export const obtenerVisitaByIdUser = async (req, res) => {
    const { limit, page } = req.query;
    const usuarioId = req.user._id;
   
    const visitas = await obtenerVisitasService(limit, page, usuarioId);
    res.json(visitas);
}

export const actualizarVisita = async (req, res) => {

    const { categoriaId, fecha, hora } = req.body;

    const usuarioId = req.user._id;

    const visita = await actualizarVisitaService(
        req.params.id,
        usuarioId,
        {
            categoriaId,
            fecha,
            hora
        }
    );

    await actualizarEnUsoCategoriaService(categoriaId);
    res.status(200).json(visita);
};

export const eliminarVisita = async (req, res) => {

    const usuarioId = req.user._id;

    const visita = await eliminarVisitaService(
        req.params.id,
        usuarioId
    );

    const categoriaId = visita.categoriaId;

    await actualizarEnUsoCategoriaService(categoriaId);

    res.status(200).json({
        mensaje: "Visita eliminada correctamente",
        visita
    });
};

export const obtenerVisitasFechas = async (req, res) => {
    const { min, max } = req.query;
    const visitas = await obtenerVisitasFechasService(min, max);
    res.json(visitas);
}

