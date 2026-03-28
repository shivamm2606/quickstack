// Eliminates repetitive try/catch boilerplate in every controller function. Throw error (if any) to global error handler.
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
