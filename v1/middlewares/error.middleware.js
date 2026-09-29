export const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Error interno del servidor";
    const details = err.details || null;
    res.status(status).json({ status_code: status, message, details });
}