import Rutina from "../models/rutina.model.js";
import { obtenerConsultaGroqService } from "./groq.service.js";

export const crearRutinaService = async (rutinaData) => {

    const { userid, musculos } = rutinaData;

    const messages = [
        {
            role: "system",
            content:
                "Sos un asistente especializado en rutinas de gimnasio. " +
                "A partir de los músculos indicados, generá una rutina de ejercicios. " +
                "Respondé únicamente con un JSON que tenga exactamente las propiedades " +
                "\"musculos\" y \"ejercicios\". " +
                "\"musculos\" debe ser un string y \"ejercicios\" debe ser un string."
        },
        {
            role: "user",
            content: `Generá una rutina para trabajar los siguientes músculos: ${musculos}`
        }
    ];

    let respuestaIA;

    try {
        respuestaIA = await obtenerConsultaGroqService(messages);
    } catch (error) {

        const errorIA = new Error(
            "El servicio de inteligencia artificial no está disponible actualmente."
        );

        errorIA.statusCode = 503;
        errorIA.code = "AI_SERVICE_UNAVAILABLE";

        throw errorIA;
    }

    let rutinaGenerada;

    try {
        rutinaGenerada = JSON.parse(respuestaIA);
    } catch (error) {

        const errorIA = new Error(
            "La respuesta de inteligencia artificial no tiene un formato válido."
        );

        errorIA.statusCode = 502;
        errorIA.code = "INVALID_AI_RESPONSE";

        throw errorIA;
    }

    const rutina = new Rutina({
        userid,
        musculos: rutinaGenerada.musculos,
        ejercicios: rutinaGenerada.ejercicios
    });

    await rutina.save();

    return rutina;
}; 

