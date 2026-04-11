import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'Joi Validation Error',
      details: err.details.map((d) => d.message),
    });
  }
};
