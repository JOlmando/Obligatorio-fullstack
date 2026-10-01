import Usuario from "../models/usuario.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";
import { getCloudinary } from "../config/cloudinary.js";


export const loginService = async (username, password) => {
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
        const error = new Error("Datos incorrectos");
        error.status = 404;
        error.details = { username };
        throw error;
    }
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
        const error = new Error("Datos incorrectos");
        error.status = 401;
        error.details = { username };
        throw error;
    }
    
    const token = jwt.sign({ usuario: username, tipoUsuario: usuario.tipoUsuario, _id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return { usuario, token };
};

// export const registerService = async (username, password) => {
//     const usuarioExistente = await Usuario.findOne({ username });
//     if (usuarioExistente) {
//         const error = new Error("El usuario ya existe");
//         error.status = 409;
//         error.details = { username };
//         throw error;
//     }
//     const hashedPassword = bcrypt.hashSync(password, Number(process.env.ROUND));

//     const usuario = new Usuario({ username, password: hashedPassword, tipoUsuario: "CLIENTE", plan: "PLUS"});
//     const token = jwt.sign({ usuario: username, tipoUsuario:"CLIENTE", _id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
//     await usuario.save();
//     return { usuario, token };
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const registerService = async (username, password, imageBuffer = null) => {
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
        const error = new Error("El usuario ya existe");
        error.status = 409;
        error.details = { username };
        throw error;
    }

    const hashedPassword = bcrypt.hashSync(password, Number(process.env.ROUND));



    let fotoPerfil = null;
    if (imageBuffer) {
        const cloudinary = getCloudinary();
        const result = await uploadBufferToCloudinary(cloudinary, imageBuffer, {
            resource_type: "image",
            folder: "perfiles",
        });
        fotoPerfil = result.secure_url;
    }

    const usuario = new Usuario({ 
        username, 
        password: hashedPassword, 
        tipoUsuario: "CLIENTE", 
        plan: "PLUS",
        fotoPerfil
    });

    const token = jwt.sign(
        { usuario: username, tipoUsuario: "CLIENTE", _id: usuario._id }, 
        process.env.SECRET_KEY, 
        { expiresIn: '1h' }
    );

    await usuario.save();
    return { usuario, token };
};
