const https = require("https");
const mongoose = require("mongoose");
const fs = require("fs");

const http = require("http");

const http2 = require("http2");

const router = require("./router");
const middleware = require("./middleware");
const error = require("./errors");

const api = require("../Routes/api");
const frontend = require("../Routes/frontend");

// router.get("/api/admin/login", (res) => {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.write("Got to login");
//     res.end();
// });

//-----------------------------MIDDLEWARES-----------------------------

// middleware.mw("/api/admin", (req) => {
//     console.log("jotakin");
//     return true;
// });
// middleware.mw("/api", (req) => {
//     console.log("Temp callback");
//     console.log("failed auth!");
//     return true;
// });

//-----------------------------ERRORS-----------------------------

//File not found
error.setError(404, (res) => {
    router.routeToFileAsync(
        res,
        "./frontend/html/404.html",
        "text/html",
        (res, err) => {
            console.log("Route to 404 failed!");
            console.log(err);
            res.writeHead(404, {
                "Content-Type": "text/html"
            });
            res.write("404 File Not Found");
            res.end();
        }
    );
});

//Method not allowed
error.setError(405, (res) => {
    res.writeHead(405, {
        "Content-Type": "text/html"
    });
    res.write("405 Method Not Allowed");
    res.end();
});

//-----------------------------SERVER-----------------------------
//Connect to db
try {
    mongoose.connect("mongodb://localhost:27017/test", {
        useNewUrlParser: true
    });
    console.log("Connected to DB!");
} catch (error) {
    console.log("Could not connect to DB!");
    console.log(error);
}

var options = {
    key: fs.readFileSync("./SSL/localhost.key"),
    cert: fs.readFileSync("./SSL/localhost.crt")
};

//MAIN SERVER
const server = http2.createSecureServer(options, (req, res) => {
    console.log(
        "---------------------------------------REQ--------------------------------------"
    );
    if (middleware.executeMw(req)) {
        try {
            router.route(req, res);
        } catch (res_code) {
            console.log(res_code);
            error.handleError(res, res_code);
        }
    } else {
        error.handleError(res, 500);
    }
});

server.listen(443, () => {
    console.log("Listening on port 443");
});

//UPGRADE SERVER
const upgrade_server = http.createServer((req, res) => {
    console.log(
        "---------------------------------------UPGRADING--------------------------------------"
    );
    console.log("UPGRADING TO " + "https://" + req.headers.host + req.url);
    res.writeHead(302, {
        Location: "https://" + req.headers.host + req.url
    });
    res.end();
});

upgrade_server.listen(80);

// //HTTP2 SERVER
// const http2_server = http2.createSecureServer(options, (req, res) => {
//     console.log("REQUEST TO HTTP2");
// });

// http2_server.listen(3001);
