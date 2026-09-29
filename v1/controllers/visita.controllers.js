import { 
    crearVisitaService, 
    obtenerVisitaPorIdService,
    obtenerVisitasService,
    actualizarVisitaService,
    eliminarVisitaService, } from "../services/visitas.services.js";

import {actualizarEnUsoCategoriaServices} from "../services/categorias.services.js"

export const obtenerVisitas = async (req, res) => {
    const { limit, page } = req.query;
    const visitas = await obtenerVisitasService(limit, page);
    res.json(visitas);
}

// Generar logica de visitas
export const crearVisita = async (req, res) => {
    const { categoriaId, fecha, hora } = req.body;
    const usuarioId = req.decoded._id; // Obtener el ID del usuario desde el token de autenticación
    const visita = await crearVisitaService({
        usuarioId,
        categoriaId,
        fecha,
        hora
    });
    await actualizarEnUsoCategoriaServices(categoriaId);
    res.status(201).json(visita);
};

export const obtenerVisitaPorId = async (req, res) => {
    const { id } = req.params;
    const visita = await obtenerVisitaPorIdService(id);
    res.json(visita);
}

export const actualizarVisita = async (req, res) => {
    const { id } = req.params;
    const visita = await actualizarVisitaService(id, req.body);
    res.json(visita);
}

export const eliminarVisita = async (req, res) => {
    const { id } = req.params;
    const visita = await eliminarVisitaService(id);
    res.json(visita);
}

// export const obtenerVisitasFechas = async (req, res) => {
//     const { min, max } = req.query;
//     const visitas = await obtenerProductosXRangoPrecioService(min, max);
//     res.json(visitas);
// }

