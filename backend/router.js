const url_parser = require("url");
const fs = require("fs");
const error = require("./errors");

var gets = {};
var posts = {};

function get(path, callback) {
    gets[path] = callback;
}

function post(path, callback) {
    posts[path] = callback;
}

function route(req, res) {
    const url = url_parser.parse(req.url, true);
    console.log("REQUESTING " + url.pathname);

    if (gets[url.pathname]) {
        if (req.method == "GET") {
            gets[url.pathname](res);
        } else {
            throw 405;
        }
    } else if (posts[url.pathname]) {
        if (req.method == "POST") {
            posts[url.pathname](req, res);
        } else {
            throw 405;
        }
    } else {
        console.log("Route did not exist");
        throw 404;
    }
}

function routeToFileAsync(res, path, content_type, error_fallback) {
    fs.readFile(path, (err, data) => {
        if (err) {
            if (typeof error_fallback == "function") {
                error_fallback(res, err);
            } else {
                error.handleError(res, 404);
            }
        } else {
            res.writeHead(200, {
                "Content-Type": content_type
            });
            res.write(data);
            res.end();
        }
    });
}

function pushAsset(stream, request_path, resource_path, content_type) {
    stream.pushStream({ ":path": request_path }, (err, pushStream, headers) => {
        pushStream.respondWithFile(resource_path, {
            "Content-Type": content_type
        });
    });
}

module.exports = {
    get,
    post,
    route,
    routeToFileAsync,
    pushAsset
};
