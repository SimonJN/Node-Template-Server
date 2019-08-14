var errors = {};

var default_handler = (res, error_code) => {
    res.writeHead(error_code, {
        "Content-Type": "text/html"
    });
    res.write("ERROR: " + error_code);
    res.end();
};

function setError(error_code, callback) {
    errors[error_code] = callback;
}

function setDefaultHandler(callback) {
    default_handler = callback;
}

//-----------------------------HANDLER-----------------------------

function handleError(res, error_code) {
    if (errors[error_code]) {
        errors[error_code](res);
    } else {
        default_handler(res, error_code);
    }
}

module.exports = {
    setError,
    handleError,
    setDefaultHandler
};
