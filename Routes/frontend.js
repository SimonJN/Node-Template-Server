const router = require("../backend/router");

//-----------------------------ROUTES-----------------------------

router.get("/", (res) => {
    router.pushAsset(
        res.stream,
        "/main.css",
        "./frontend/css/main.css",
        "text/css"
    );
    router.routeToFileAsync(res, "./frontend/html/main.html", "text/html");
});

router.get("/one", (res) => {
    router.routeToFileAsync(res, "./frontend/html/one.html", "text/html");
});

router.get("/two", (res) => {
    router.routeToFileAsync(res, "./frontend/html/two.html", "text/html");
});

router.get("/main.css", (res) => {
    router.routeToFileAsync(res, "./frontend/css/main.css", "text/css");
});

router.get("/favicon.ico", (res) => {
    router.routeToFileAsync(res, "./favicon.png", "image/png");
    // res.writeHead(200, {
    //     Location:
    //         "https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico?v=4f32ecc8f43d"
    // });
    // res.end();
});
