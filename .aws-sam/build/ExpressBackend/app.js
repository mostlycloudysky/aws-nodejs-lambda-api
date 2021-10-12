const serverless = require('serverless-http');
const express = require('express');
const s3 = require('aws-sdk/clients/s3');
const env = require('env-var');
const bodyParser = require('body-parser');
import { v5 as uuidv5 } from 'uuid';
// @ts-ignore
const app = new express();

const plainTextParser = bodyParser.text();

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error'});
})

function newS3Client() {
    return new s3({ params: { Bucket: env.get('BUCKET').required().asString() } })
}

function getAuthor() {
    return 'anonymous';
}

app.get('/', async (req, res) => {
    const client = newS3Client();
    const maxItems = req.query.maxItems || 20;
    const token = req.query.token;
})

async function writeMessage(s3, message, author) {
    const namespace = v5(author, v5.URL);
    const id = v5(message, namespace);


}

module.exports.lambdaHandler = serverless(app);