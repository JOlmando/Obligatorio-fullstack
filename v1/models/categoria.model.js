import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    horarios: { type: String, required: true }
});

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default CAtegoria;