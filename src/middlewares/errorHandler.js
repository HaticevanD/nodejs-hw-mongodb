export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    status,
    message: err.message || 'Something went wrong',
  });
};
