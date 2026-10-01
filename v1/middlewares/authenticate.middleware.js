import jwt from 'jsonwebtoken';


export const authenticateMiddleware = (req, res, next) => {

    //En el header de las requests se espera que el token esté en el formato "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({  status_code: 401, message: 'No se proporcionó el token' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({  status_code: 401, message: 'Token inválido' });
    }
    
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({  status_code: 401, message: 'Token inválido' });
            }
            // Si el token es válido, se adjunta la información del usuario a la solicitud
            req.user = decoded;
            next();
        });
};

export const verificarAdmin = (req, res, next) => {

    if (req.user.tipoUsuario !== "ADMIN") {
        return res.status(403).json({
            status_code: 403,
            mensaje: "No tiene permisos para realizar esta acción"
        });
    }

    next();
};