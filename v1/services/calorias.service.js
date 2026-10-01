import axios from 'axios';

const FINDUTILS_URL =
  'https://api.findutils.com/api/tools/tdee-calculator/execute';

const actividades = {
  sedentary: {
    nombre: 'sedentario',
    descripcion: 'Trabajo sedentario y poco ejercicio',
    multiplicador: 1.2
  },
  light: {
    nombre: 'ligero',
    descripcion: 'Ejercicio ligero 1 a 3 días por semana',
    multiplicador: 1.375
  },
  moderate: {
    nombre: 'moderado',
    descripcion: 'Ejercicio 3 a 5 días por semana',
    multiplicador: 1.55
  },
  active: {
    nombre: 'activo',
    descripcion: 'Ejercicio intenso 6 a 7 días por semana',
    multiplicador: 1.725
  },
  very_active: {
    nombre: 'muy activo',
    descripcion: 'Ejercicio intenso diario o trabajo físico',
    multiplicador: 1.9
  },
  extra_active: {
    nombre: 'extremadamente activo',
    descripcion: 'Trabajo físico y entrenamiento diario',
    multiplicador: 2.1
  }
};

const objetivos = {
  lose: 'bajar de peso',
  maintain: 'mantener peso',
  gain: 'subir de peso'
};

export const calcularCaloriasServices = async ({
  sexo,
  edad,
  peso,
  altura,
  actividad,
  objetivo
}) => {
  try {
    const response = await axios.post(
      FINDUTILS_URL,
      {
        gender: sexo,
        age: edad,
        weight: peso,
        height: altura,
        unit_system: 'metric',
        activity_level: actividad,
        goal: objetivo
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const resultado = response.data.result;

    const actividadInfo = actividades[resultado.activity_level];

    return {
      metabolismoBasal: resultado.bmr,
      gastoDiario: resultado.tdee,

      actividad: {
        nivel: actividadInfo.nombre,
        descripcion: actividadInfo.descripcion,
        multiplicador: resultado.activity_multiplier
      },

      objetivo: objetivos[resultado.goal],

      caloriasObjetivo: {
        leve: resultado.goal_calories.mild,
        moderado: resultado.goal_calories.moderate,
        alto: resultado.goal_calories.extreme
      },

      macrosDiarios: {
        proteinas: {
          gramos: resultado.macros.protein,
          porcentaje: 30
        },
        carbohidratos: {
          gramos: resultado.macros.carbs,
          porcentaje: 35
        },
        grasas: {
          gramos: resultado.macros.fat,
          porcentaje: 35
        }
      },

      peso: resultado.weight_kg,
      altura: resultado.height_cm
    };

  } catch (error) {
    console.error(
      'Error consumiendo FindUtils:',
      error.response?.data || error.message
    );

    throw new Error(
      'No fue posible obtener el cálculo nutricional'
    );
  }
};

