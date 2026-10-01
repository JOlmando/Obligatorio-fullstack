import { calcularCaloriasServices } from '../services/calorias.service.js';

export const calcularCalorias = async (req, res) => {
  try {
    const resultado = await calcularCaloriasServices(req.body);

    return res.status(200).json({
      mensaje: 'Cálculo realizado correctamente',
      datos: resultado
    });
  } catch (error) {
    console.error('Error en calcularCalorias:', error.message);

    return res.status(503).json({
      mensaje: error.message
    });
  }
};

