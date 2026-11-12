import { loginService, registerService } from '../services/auth.services.js';

export const ingresarUsuario = async (req, res) => {
    try {
        const {username, password} = req.body;
        const result = await loginService(username, password);
        res.status(201).json({ message: 'Iniciando sesión', usuario: { username: result.usuario.username, plan: result.usuario.plan, fotoPerfil: result.usuario.fotoPerfil }, token: result.token });
    } catch (error) {
        res.status(error.status || 500).json({ status_code: error.status || 500, message: error.message });
    }
};

// export const registrarUsuario =  async (req, res) => {
//   const { username, password } = req.body;
//   const { usuario, token } = await registerService(username, password);
//   res.json({ message: 'Registrando usuario...', usuario: { username}, token });
// };

export const registrarUsuario = async (req, res) => {
    try {
        const { username, password } = req.body;
        const imageBuffer = req.file ? req.file.buffer : null;

        const result = await registerService(username, password, imageBuffer);
        res.status(201).json({ message: 'Registrando usuario', usuario: { username: result.usuario.username, plan: result.usuario.plan, fotoPerfil: result.usuario.fotoPerfil }, token: result.token });
    } catch (error) {
        res.status(error.status || 500).json({ status_code: error.status || 500, message: error.message });
    }
};