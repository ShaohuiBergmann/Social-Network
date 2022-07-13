const aws = require("aws-sdk");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

//bellow creates an instance of an AWS user --->
//it's just an object that gives us a bunch of communicate and interact
//with our s3 cloud storage that amazon calls bucket
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRETS,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no image on request body");
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            console.log("the cloud it's working");
            next();
            fs.unlink(path, () => {
                console.log("it's cleaned");
            });
        })
        .catch((err) => {
            console.log("sth wet wrong with the cloud", err);
            res.sendStatus(500);
        });
};
