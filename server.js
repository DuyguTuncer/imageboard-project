const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/imageboard", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in /imageboard : ", err);
            return err;
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    const fullUrl = "https://s3.amazonaws.com/duyguimageboard/" + req.file.filename;
    console.log("fullUrl:", fullUrl);

    db.uploadImage(
        fullUrl,
        req.body.username || null,
        req.body.title || null,
        req.body.description || null
    )
        .then(({ rows }) => {
            console.log("results", rows);
            res.json({
                id: rows[0].id,
                title: req.body.title,
                description: req.body.description,
                username: req.body.username,
                url: rows[0].url,
            });
        })
        .catch((err) => console.log("Error in uploading image", err));
});

app.get("/showmore", function (req, res) {
    db.showMoreImages()
        .then(({ rows }) => {
            console.log("results.rows", rows);
        })
        .catch((err) => console.log("Erororo in rendering more images", err));
});


app.listen(8080, () => console.log("Listening 8080, this time for imageboard!"));
