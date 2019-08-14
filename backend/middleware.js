const url_parser = require("url");

var middlewares = {};

function mw(path, callback) {
    if (typeof middlewares[path] === "undefined") {
        middlewares[path] = [];
    }
    middlewares[path].push(callback);
}

function executeMw(req) {
    const url = url_parser.parse(req.url, true);
    const path = url.pathname;
    console.log("Path is: " + path);
    const path_parts = path.split("/");
    //Remove the first element of the parts since the paths start with a "/" and that makes the first element empty
    path_parts.shift(1);
    console.log(path_parts);

    var current_mw_path = "";
    for (let i = 0; i < path_parts.length; i++) {
        current_mw_path += "/" + path_parts[i];
        console.log("Searching path: " + current_mw_path);

        //If a mw exists for the path
        if (!(typeof middlewares[current_mw_path] === "undefined")) {
            //A path can have multiple mw:s
            for (let j = 0; j < middlewares[current_mw_path].length; j++) {
                console.log("Executing MW number: " + j);
                const success = middlewares[current_mw_path][j](req);
                if (!success) {
                    return false;
                }
            }
        }
    }

    return true;
}

module.exports = {
    mw,
    executeMw
};
