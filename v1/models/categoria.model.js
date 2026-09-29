import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true, 
        unique: true 
    },

    horarios: { 
        type: String, 
        required: true 
    },
    
    enUso: {
        type: Boolean,
        default: false
    }
});

const Categoria = mongoose.model("Categoria", categoriaSchema, "categorias");

export default Categoria;