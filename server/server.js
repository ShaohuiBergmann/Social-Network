const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");

app.use(compression());

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;
app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.post("/register", (req, res) => {
    bcrypt
        .hash(req.body.pwd)
        .then((hash) => {
            console.log("hashpwd", hash);
            db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hash
            ).then((results) => {
                console.log("results", results.rows);
                req.session.userId = results.rows[0].id;
                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log("err", err);
            res.json({ success: false });
        });
});
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
