import { 
    crearRutinaService
} from "../services/rutinas.services.js";


export const crearRutina = async (req, res) => {

    const userid = req.user._id;
    console.log("Usuario ID:", req.user._id); // Agrega este log para verificar el valor de userid
    console.log("Usuario ID:", userid); // Agrega este log para verificar el valor de userid
    const { musculos } = req.body;

    const rutina = await crearRutinaService({ 
        userid, 
        musculos 
     });
    res.status(200).json(rutina);
}