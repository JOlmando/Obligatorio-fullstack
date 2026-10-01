export const validateQueryMiddleware = (schema) => {

    return (req, res, next) => {

        const { value, error } = schema.validate(req.query, {
            abortEarly: false
        });

        if (error) {
            return res.status(400).json({
                status_code: 400,
                details: error.details
            });
        }

        req.validatedQuery = value;

        next();
    };
};