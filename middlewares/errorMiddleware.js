const notFoundHandler = (req, res) => {
    res.status(404)
    throw new Error(`Not Found - ${req.originalUrl}`);
}

const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(res.statusCode || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
        status: "KO"
    });
}

module.exports = { errorHandler, notFoundHandler }
