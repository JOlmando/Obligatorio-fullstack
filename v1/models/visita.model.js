import mongoose from "mongoose";

const visitaSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

    categoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },

    fecha: {
        type: String
    },

    hora: {
        type: String
    }
});

const Visita = mongoose.model("Visita", visitaSchema, "visitas");

export default Visita;




