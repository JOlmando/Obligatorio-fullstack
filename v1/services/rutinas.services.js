import Rutina from "../models/rutina.model.js";
import {obtenerConsultaGroqService} from "../services/groq.service.js";

export const crearRutinaService = async (rutinaData) => {
    const rutina = new Rutina(rutinaData);
    
    await rutina.save();
    return rutina;
}