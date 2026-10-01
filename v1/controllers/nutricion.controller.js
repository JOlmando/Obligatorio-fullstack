import { obtenerAlimentosService } from "../services/nutricion.services.js";

export const obtenerAlimentos = async (req, res) => {

    const { comida } = req.validatedQuery;

    const alimentos = await obtenerAlimentosService(comida);

    res.status(200).json(alimentos);
};