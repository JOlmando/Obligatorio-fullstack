import Joi from "joi";

export const comidaSchema = Joi.object({

    comida: Joi.string()
        .trim()
        .lowercase()
        .valid("desayuno", "almuerzo", "merienda", "cena")
        .required()
        .messages({
            "string.empty": "La comida no puede estar vacía",
            "any.only": "La comida debe ser desayuno, almuerzo, merienda o cena",
            "any.required": "La comida es obligatoria"
        })

});

