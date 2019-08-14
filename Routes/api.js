const { parse } = require("querystring");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const router = require("../backend/router");

const User = mongoose.model("User", { username: String, password: String });

router.post("/api/user/register", (req, res) => {
    parsePostBody(req, (parsed_body) => {
        if (parsed_body.username && parsed_body.password) {
            registerUser(parsed_body.username, parsed_body.password, (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(200, { ContentType: "text/html" });
                    res.write("FAILED TO REGISTER " + parsed_body.username);
                    res.end();
                } else {
                    res.writeHead(200, { ContentType: "text/html" });
                    res.write("Register done for " + parsed_body.username);
                    res.end();
                }
            });
        } else {
            res.writeHead(200, { ContentType: "text/html" });
            res.write("FAILED TO REGISTER " + parsed_body.username);
            res.end();
        }
        return 200;
    });
});

router.post("/api/user/login", (req, res) => {
    parsePostBody(req, (parsed_body) => {
        if (parsed_body.username && parsed_body.password) {
            loginUser(
                parsed_body.username,
                parsed_body.password,
                (err, loginRes) => {
                    if (loginRes == true) {
                        res.writeHead(200, { ContentType: "text/html" });
                        res.write("Logged in " + parsed_body.username + "!");
                        res.end();
                    } else {
                        console.log(err);
                        res.writeHead(200, { ContentType: "text/html" });
                        res.write("FAILED TO LOGIN " + parsed_body.username);
                        res.end();
                    }
                }
            );
        } else {
            res.writeHead(200, { ContentType: "text/html" });
            res.write("FAILED TO LOGIN " + parsed_body.username);
            res.end();
        }
    });
});

function parsePostBody(req, callback) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) request.connection.destroy();
    });

    req.on("end", () => {
        callback(parse(body));
    });
}

//--------------------------------------------API-functions------------------------------------
function registerUser(username, password, callback) {
    //Hash the password and then store it
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    const newUser = new User({
                        username: username,
                        password: hash
                    });
                    //If it got to here, no error was present so pass in false
                    newUser.save().then(callback(false));
                }
            });
        }
    });
}

function loginUser(username, password, callback) {
    User.findOne({ username: username }, "password", (err, hashed_password) => {
        if (err || hashed_password == null) {
            callback(err);
        } else {
            console.log("Got from db password: " + hashed_password.password);
            bcrypt.compare(password, hashed_password.password, callback);
        }
    });
}
