import Joi from 'joi';

const objectId = Joi.string().hex().length(24).messages({
  'string.hex': 'El id debe ser un ObjectId válido',
  'string.length': 'El id debe tener 24 caracteres',
  'any.required': 'El id es obligatorio',
});

export const crearCategoriaSchema = Joi.object({
    nombre: Joi.string()
            .min(3)
            .required()
            .messages({
                'string.empty': 'El nombre no puede estar vacío',
                'string.min': 'El nombre debe tener al menos {#limit} caracteres',
                'any.required': 'El nombre es obligatorio',
            }),
    horarios: Joi.string()
        .trim()
        .required()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/)
        .messages({
            'string.empty': 'El horario no puede estar vacío',
            'string.pattern.base': 'El horario debe tener el formato HH:mm-HH:mm',
            'any.required': 'El horario es obligatorio',
        }),
    enUso: Joi.boolean()
});

export const categoriaIdParamSchema = Joi.object({
    id: objectId.required()
});