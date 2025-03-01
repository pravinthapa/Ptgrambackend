const { Constants } = require("../Constants");
const ErrorHandeler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case Constants.VALIDATION_ERROR:
      res.json({
        title: "Validation failed",
        message: err.message,
        stackTraces: err.stack,
      });
      break;
    case Constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTraces: err.stack,
      }); 
      break;
    case Constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTraces: err.stack,
      });
      break;
    case Constants.SERVER_ERROR:
      res.json({
        title: "Server error",
        message: err.message,
        stackTraces: err.stack,
      });
      break;
    case Constants.NOT_FOUND: 
      res.json({
        title: "Not found",
        message: err.message,
        stackTraces: err.stack,
      });
    default:
      break;
  }
};
module.exports = ErrorHandeler;
