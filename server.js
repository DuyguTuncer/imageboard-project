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

// uploder.single("file") file: is the name of the form data property that holds the file.
// multer will put title, desc, etc to the --> req.body.
// differnt for file: where the file is going to be added to the req object, file property. --> req.file

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
            // res.json(rows);
        })
        .catch((err) => console.log("Error in uploading image", err));

    // if (!req.file) {
    //     console.log("upload failed for some reason!");
    //     res.sendStatus(500);
    // } else {
    //     // yay, it worked
    // }
});

app.listen(8080, () => console.log("Listening 8080, this time for imageboard!"));
