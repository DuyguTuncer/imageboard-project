const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next ) => {
    if(!req.file) {
        return res.sendStatus(500);
    }
    // console.log("req.file in upload function S3");

    // there should be file/img upload if we come here
    const{filename, mimetype, size, path} = req.file;

    const promise = s3
        .putObject({
            Bucket: "duyguimageboard",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); // AWS method, to convert this function a promise

    promise
        .then(() => {
            // it worked!!!, this will run when we upload our imaoges succesfully to AWS
            console.log("this is from s3.js -> amazon upload complete");
            // optional
            // fs.unlink(path, () => {});
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("err in s3 upload put object: ", err);
            res.sendStatus(404);
        });

};
