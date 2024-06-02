const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal server error ";
  err.statusCode ||= 500;

  // if error name is cast error hoe to represent them
  if (err.name === "CastError") {
    console.log(err);
    const errorPath = err.path;
    err.message = `Invalid format of ${errorPath}`;
    err.statusCode = 400;
  }

  //   console.log(err.path);

  //   if error is duplication

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate field value entered ${error}`;
    err.statusCode = 400;
  }

  const response = {
    success: false,
    message: err.message,
  };

  return res.status(err.statusCode).json(response);
};

export { errorMiddleware };
