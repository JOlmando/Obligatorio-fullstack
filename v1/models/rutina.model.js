import mongoose from "mongoose";

const rutinaSchema = new mongoose.Schema({

    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

    musculos: {
        type: String,
        required: true
    },

    ejercicios: {
        type: String,
        required: true
    }

});

const Rutina = mongoose.model("Rutina", rutinaSchema, "rutinas");

export default Rutina;