import Usuario from "../models/usuario.model.js";

export const changePlanService = async (userId) => {
    
    const usuario = await Usuario.findById(userId);

    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.statusCode = 404;
        throw error;
    }

    if (usuario.plan === "PREMIUM") {
        const error = new Error(
            "El usuario ya tiene el plan Premium"
        );
        error.statusCode = 400;
        throw error;
    }

    usuario.plan = "PREMIUM";

    await usuario.save();

    return {username: usuario.username, plan: usuario.plan, message: "El plan del usuario ha sido actualizado a Premium"};

};
        
