import { 
    crearRutinaService
} from "../services/rutinas.services.js";


export const crearRutina = async (req, res) => {

    const userid = req.user._id;
    const { musculos } = req.body;

    const rutina = await crearRutinaService({ 
        userid, 
        musculos 
     });
    res.status(200).json(rutina);
}