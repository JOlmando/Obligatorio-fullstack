import { 
    crearVisitaService, 
    obtenerVisitaPorIdService,
    obtenerVisitasService,
    actualizarVisitaService,
    eliminarVisitaService } from "../services/visitas.services.js";

export const obtenerVisitas = async (req, res) => {
    const visitas = await obtenerVisitasService();
    res.json(visitas);
}

// Generar logica de visitas
export const crearVisita = async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const visita = await crearVisitaService({ nombre, precio, descripcion });
    res.status(201).json(visita);
}
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

export const visitaProducto = async (req, res) => {
    const { id } = req.params;
    const visita = await eliminarVisitaService(id);
    res.json(visita);
}

