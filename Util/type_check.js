//File extension : MIME-type
const types = {
    html: "text/html",
    css: "text/css",
    png: "image/png"
};

function checkType(path) {
    const path_parts = path.split(".");
    const extension = path_parts[path_parts.length - 1];
    return types[extension];
}

module.exports = {
    checkType
};
