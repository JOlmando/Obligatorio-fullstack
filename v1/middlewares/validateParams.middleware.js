export const validateParamsMiddleware = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        status_code: 400,
        message: error.details[0].message
      });
    }
    req.validatedParams = value;
    next();
  };
};