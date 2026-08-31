import express from "express";
import v1Routes from "./v1/index.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", v1Routes);

app.get('/', (req, res) => {
    res.send('Hola queridoo!')
})

export default app;