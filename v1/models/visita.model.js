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
        type: String,
        required: true
    },

    hora: {
        type: String,
        required: true
    }
});

const Visita = mongoose.model("Visita", visitaSchema);

export default Visita;




