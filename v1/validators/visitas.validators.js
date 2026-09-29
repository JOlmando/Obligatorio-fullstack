import Joi from 'joi';

const objectId = Joi.string().hex().length(24).messages({
  'string.hex': 'El id debe ser un ObjectId válido',
  'string.length': 'El id debe tener 24 caracteres',
  'any.required': 'El id es obligatorio',
});

export const crearVisitaSchema = Joi.object({

  categoriaId: objectId.required().messages({
    'any.required': 'La categoría es obligatoria',
  }),

  fecha: Joi.string()
    .trim()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.empty': 'La fecha no puede estar vacía',
      'string.pattern.base': 'La fecha debe tener el formato YYYY-MM-DD',
      'any.required': 'La fecha es obligatoria',
    }),

  hora: Joi.string()
    .trim()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/)
    .messages({
        'string.empty': 'La hora no puede estar vacía',
        'string.pattern.base': 'La hora debe tener el formato HH:mm-HH:mm',
        'any.required': 'La hora es obligatoria',
    }),

});

export const visitaIdParamSchema = Joi.object({
  id: objectId.required(),
});

export const modificarVisitaSchema = Joi.object({

  categoriaId: objectId.required().messages({
    'any.required': 'La categoría es obligatoria',
  }),

  fecha: Joi.string()
    .trim()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      'string.empty': 'La fecha no puede estar vacía',
      'string.pattern.base': 'La fecha debe tener el formato YYYY-MM-DD',
      'any.required': 'La fecha es obligatoria',
    }),

  hora: Joi.string()
    .trim()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/)
    .messages({
        'string.empty': 'La hora no puede estar vacía',
        'string.pattern.base': 'La hora debe tener el formato HH:mm-HH:mm',
        'any.required': 'La hora es obligatoria',
    }),

});