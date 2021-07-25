const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("./public"));

app.get("/imageboard", (req, res) => {
    db.getImages()
        .then(({ rows: images }) => {
            console.log("rows: ", images);
            res.json(images);
        })
        .catch((err) => {
            console.log("error in /imageboard: ", err);
            return err;
        });
});

app.listen(8080, () => console.log("Listening 8080, this time for imageboard!"));
