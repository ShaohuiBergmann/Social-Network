const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const ses = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");

const multer = require("multer");
const s3 = require("./s3");
const uidSafe = require("uid-safe");

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

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file, callback) {
        const randomFileName = uidSafe(24).then((randomString) => {
            callback(null, randomString + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

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

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.post("/password/reset/start", (req, res) => {
    const secretCode = cryptoRandomString({
        length: 6,
    });
    db.findUser(req.body.email)
        .then((results) => {
            console.log("reset", results.rows[0]);
            if (results.rows[0].email) {
                db.insertCode(results.rows[0].email, secretCode).then(() => {
                    ses.sendEmail(
                        results.rows[0].email,
                        `Your confirmation code is: ${secretCode} - enter it in your reset password page.`,
                        "Reset Password"
                    )
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("err at sending email", err);
                            res.json({
                                error: true,
                            });
                        });
                });
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

app.get("/user", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("Error at getting userinfo", err);
        });
});

app.get("/users/:id", (req, res) => {
    if (req.session.userId == req.params.id) {
        res.json({
            selfLoggedIn: true,
        });
    }
    db.getUserInfo(req.params.id)
        .then((results) => {
            if (results.rows[0]) {
                res.json(results.rows[0]);
            } else {
                res.json({ notFound: true });
            }
        })
        .catch((err) => {
            console.log("Error at getting other userinfo", err);
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    db.updateImg(
        "https://s3.amazonaws.com/spicedling/" + req.file.filename,
        req.session.userId
    )
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("there is something wrong at update image", err);
        });
});

app.post("/add/bio", (req, res) => {
    db.updateBio(req.session.userId, req.body.bio)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("there is something wrong at adding bio", err);
        });
});

app.get("/findusers", (req, res) => {
    db.getRecentUsers()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log(
                "there is something wrong at getting recent users",
                err
            );
        });
});

app.get("/findusers/:search", (req, res) => {
    db.searchUsers(req.params.search)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("there is something wrong at finding users", err);
        });
});

app.get("/friendship/:id", (req, res) => {
    console.log("friend", req.params.id);
    db.checkFriendship(req.session.userId, req.params.id)
        .then((results) => {
            console.log("at friendship", results.rows);
            if (results.rows[0]) {
                res.json(results.rows[0]);
            } else {
                res.json({ friendship: false });
            }
        })
        .catch((err) => {
            console.log("there is something wrong at checking friendship", err);
        });
});

app.post("/friendship/:id/:action", (req, res) => {
    if (req.params.action === "add") {
        console.log("adding friends");
        db.addFriendship(req.session.userId, req.params.id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log(
                    "there is something wrong at adding friendship",
                    err
                );
            });
    } else if (req.params.action === "end" || req.params.action === "cancel") {
        db.deleteFriendship(req.session.userId, req.params.id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log(
                    "there is something wrong at canceling friendship",
                    err
                );
            });
    } else {
        db.acceptFriendship(req.session.userId, req.params.id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log(
                    "there is something wrong at accepting friendship",
                    err
                );
            });
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
