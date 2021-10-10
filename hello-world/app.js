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
app.post('/', plainTextParser, async ({ body: message }, res) => {
    const client = newS3Client();
    const entry = await writeMessage(client, message, getAuthor());
    res.status(201).json(entry);
});

function ninesComplement(date) {
    return date.toISOString().split('')
        .map(c => {
            const n = parseInt(c);
            if (isNaN(n)) return c;
            else return (9 - n).toString()
        }).join('');
}

async function writeMessage(client, message, author) {
    const namespace = uuidv5(author, uuidv5.URL);
    const id = uuidv5(message, namespace);
    const date = new Date();
    const key = `${ninesComplement(date)}/${id}`
    const body = { message, date: date.toISOString(), author };
    await client.putObject({ key, Body: JSON.stringify(body)}).promise();
    return body

}

module.exports.lambdaHandler = serverless(app);