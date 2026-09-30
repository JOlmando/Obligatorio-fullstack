import { 
    changePlanService
} from "../services/usuario.services.js";


export const changePlan = async (req, res) => {
    const userId = req.user._id;
    const usuario = await changePlanService(userId);
    res.status(200).json(usuario);
}