const serverless = require('serverless-http');
const express = require('express');

// @ts-ignore
const app = new express();

app.get('/', (req, res) => {
    res.send('Hello World')
});

module.exports.lambdaHandler = serverless(app);