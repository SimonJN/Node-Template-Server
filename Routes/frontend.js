const router = require("../backend/router");
const error = require("../backend/errors");

//-----------------------------ROUTES-----------------------------

router.get("/", (res) => {
    router.pushAsset("/main.css", "./frontend/css/main.css", res.stream);
    router.routeToFileAsync(res, "./frontend/html/main.html").catch((err) => {
        error.handleError(res, err);
    });
});

router.get("/one", (res) => {
    router.routeToFileAsync(res, "./frontend/html/one.html").catch((err) => {
        error.handleError(res, err);
    });
});

router.get("/two", (res) => {
    router.routeToFileAsync(res, "./frontend/html/two.html").catch((err) => {
        error.handleError(res, err);
    });
});

router.get("/main.css", (res) => {
    router.routeToFileAsync(res, "./frontend/css/main.css").catch((err) => {
        error.handleError(res, err);
    });
});

router.get("/favicon.ico", (res) => {
    router.routeToFileAsync(res, "./favicon.png").catch((err) => {
        error.handleError(res, err);
    });
    // res.writeHead(200, {
    //     Location:
    //         "https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d"
    // });
    // res.end();
});

router.get("/test", (res) => {
    console.log("REQUESTING SOMETHING THAT WILL NEVER FINISH");
    setTimeout(() => {
        res.write("THIS IS DONE");
        res.end();
    }, 10000);
});

router.get("/err", (res) => {
    error.handleError(res, 500);
});
