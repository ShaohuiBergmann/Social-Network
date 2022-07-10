const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const ses = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");

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

app.post("/login", (req, res) => {
    db.findUser(req.body.email)
        .then((results) => {
            console.log("results at login", results.rows);
            bcrypt
                .compare(req.body.pwd, results.rows[0].passwd)
                .then((match) => {
                    if (!match) {
                        res.json({ error: true });
                    } else {
                        req.session.userId = results.rows[0].id;
                        res.json(results.rows[0]);
                    }
                })
                .catch((err) => {
                    console.log("err in comparing pwd", err);
                    res.json({
                        error: true,
                    });
                });
        })
        .catch((err) => {
            console.log("err in login", err);
            res.json({
                error: true,
            });
        });
});

app.post("/password/reset/start", (req, res) => {
    const secretCode = cryptoRandomString({
        length: 6,
    });
    db.findUser(req.body.email)
        .then((results) => {
            console.log("reset", results.rows[0]);
            if (results.rows[0].email) {
                db.insertCode(results.rows[0].email, secretCode).then(
                    (results) => {
                        ses.sendEmail(
                            results.rows[0].email,
                            `Your confirmation code is: ${secretCode} - enter it in your reset password page.`,
                            "Reset Password"
                        )
                            .then(() => {
                                res.json({ sucess: true });
                            })
                            .catch((err) => {
                                console.log("err at sending email", err);
                                res.json({
                                    error: true,
                                });
                            });
                    }
                );
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("err at finding user", err);
            res.json({
                error: true,
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    db.getCode(req.body.email)
        .then((results) => {
            if (results.rows[0].code == req.body.code) {
                bcrypt
                    .hash(req.body.newPwd)
                    .then((hash) => {
                        console.log("hashpwd", hash);
                        db.resetPassword(req.body.email, hash).then(() => {
                            res.json({ success: true });
                        });
                    })
                    .catch((err) => {
                        console.log("err at resetting pwd", err);
                        res.json({ error: true });
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("err getting code", err);
            res.json({ error: true });
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
