/**
 * Catch Erros Handlers
 */

exports.catchErrors = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            // Validation Errors
            if (typeof err === "string") {
                console.log(err);
                res.status(400).json({
                    message: "Error!"
                });
            } else {
                next(err);
            }
        });
    };
};

/**
 * MongoDB Validation Error Handler
 * Detect if there are mongoDB validation erros that we send them nicely back
 */

exports.mongooseError = (err, req, res, next) => {
    if (!err.erros) return next(err);
    const errorKeys = Object.keys(err.erros);
    let message = "";
    errorKeys.forEach((key) => (
        message += err.erros[key].message + ', '
    ));
    message = message.substr(0, message.length - 2);
    res.status(400).json({
        message,
    });
};

/**
 * Development Error Handler
 * In development, We show good Error Messages 
 * so if we hit a syntax error or any other previously un-handled error, we can show good info on what happend
 */

exports.developmentErrors = (err, req, res, next) => {
    err.stack = err.stack || "";
    const errorDetails = {
        message: err.message,
        status: err.status,
        stack: err.stack
    };

    res.status(err.status || 500).json(errorDetails); // send JSON back
};

/**
 * Production Error Handler
 * No stacktraces and error details are leaked to user
 */

exports.productionErrors = (err, req, res, next) => {
    res.status(err.status || 500).json({
        err: "Internal Server Error"
    }); // send JSON back
};

/**
 * 404 Page Error
 */

exports.notFound = (req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });
};
