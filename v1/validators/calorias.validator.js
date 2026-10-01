import Joi from 'joi';

export const calcularCaloriasSchema = Joi.object({
  sexo: Joi.string()
    .valid('male', 'female')
    .required()
    .messages({
      'any.only': 'El sexo debe ser male o female',
      'any.required': 'El sexo es obligatorio'
    }),

  edad: Joi.number()
    .integer()
    .min(1)
    .max(120)
    .required()
    .messages({
      'number.base': 'La edad debe ser un número',
      'number.integer': 'La edad debe ser un número entero',
      'number.min': 'La edad debe ser mayor a 0',
      'number.max': 'La edad no puede superar los 120 años',
      'any.required': 'La edad es obligatoria'
    }),

  peso: Joi.number()
    .positive()
    .max(500)
    .required()
    .messages({
      'number.base': 'El peso debe ser un número',
      'number.positive': 'El peso debe ser mayor a 0',
      'number.max': 'El peso no puede superar los 500 kg',
      'any.required': 'El peso es obligatorio'
    }),

  altura: Joi.number()
    .positive()
    .max(300)
    .required()
    .messages({
      'number.base': 'La altura debe ser un número',
      'number.positive': 'La altura debe ser mayor a 0',
      'number.max': 'La altura no puede superar los 300 cm',
      'any.required': 'La altura es obligatoria'
    }),

  actividad: Joi.string()
    .valid(
      'sedentary',
      'light',
      'moderate',
      'active',
      'very_active',
      'extra_active'
    )
    .required()
    .messages({
      'any.only': 'Nivel de actividad inválido',
      'any.required': 'La actividad es obligatoria'
    }),

  objetivo: Joi.string()
    .valid('lose', 'maintain', 'gain')
    .required()
    .messages({
      'any.only': 'El objetivo debe ser lose, maintain o gain',
      'any.required': 'El objetivo es obligatorio'
    })
});

// const validarCalcularCalorias = (req, res, next) => {
//   const { error } = calcularCaloriasSchema.validate(req.body, {
//     abortEarly: false,
//     stripUnknown: true
//   });

//   if (error) {
//     return res.status(400).json({
//       mensaje: 'Datos inválidos',
//       errores: error.details.map((detalle) => detalle.message)
//     });
//   }

//   next();
// };

// module.exports = {
//   validarCalcularCalorias
// };