export const validateBodyMiddleware = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        status_code: 400,
        message: error.details[0].message
      });
    }
    req.validatedBody = value;
    next();
  };
};