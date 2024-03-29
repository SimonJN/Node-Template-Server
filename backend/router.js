const url_parser = require("url");
const fs = require("fs");
const error = require("./errors");
const type_checker = require("../Util/type_check");

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

function routeToFileAsync(res, path, res_code) {
    return new Promise((resolve, reject) =>
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(404);
            } else {
                if (!res_code) {
                    res_code = 200;
                }
                res.writeHead(res_code, {
                    "Content-Type": type_checker.checkType(path)
                });
                res.write(data);
                res.end();
            }
        })
    );
}

function pushAsset(request_path, resource_path, stream) {
    stream.pushStream({ ":path": request_path }, (err, pushStream, headers) => {
        pushStream.respondWithFile(resource_path, {
            "Content-Type": type_checker.checkType(resource_path)
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
