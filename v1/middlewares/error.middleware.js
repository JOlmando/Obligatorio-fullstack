export const errorMiddleware = (err, req, res, next) => {

    const status_code = err.status_code || err.status || err.statusCode || 500;
    const message = err.message || err.msg || err.mensaje || "Error interno del servidor";
    //const details = err.details || null;
    const code = err.code || null;

    if (code) {
        res.setHeader("X-Error-Code", code);
    }
    res.status(status_code).json({ status_code, message });
}