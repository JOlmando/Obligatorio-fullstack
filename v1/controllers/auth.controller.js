import { loginService, registerService } from '../services/auth.services.js';
import { upload } from "../middlewares/multer.middleware.js";
import { runMulterSingle } from "../utils/multer.util.js";

export const ingresarUsuario = async (req, res) => {

  const {username, password} = req.body;
  const { usuario, token } = await loginService(username, password);
  res.json({ message: 'Iniciando sesión', usuario: { username }, token });
};

// export const registrarUsuario =  async (req, res) => {
//   const { username, password } = req.body;
//   const { usuario, token } = await registerService(username, password);
//   res.json({ message: 'Registrando usuario...', usuario: { username}, token });
// };

export const registrarUsuario = async (req, res) => {
    try {
        await runMulterSingle(upload, "fotoPerfil", req, res);

        const { username, password } = req.body;
        const imageBuffer = req.file ? req.file.buffer : null;

        const result = await registerService(username, password, imageBuffer);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};