const handleError = ((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Something Wrong!!" });
});

module.exports = handleError
