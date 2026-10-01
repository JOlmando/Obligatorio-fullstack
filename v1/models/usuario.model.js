import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true },

    tipoUsuario: { 
        type: String
    },
    
    plan: { 
        type: String
    },
    fotoPerfil: {
        type: String,
        default: null
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema, "usuarios");

export default Usuario;