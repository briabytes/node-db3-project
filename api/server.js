const express = require('express');
const helmet = require('helmet');

const SchemeRouter = require('./schemes/scheme-router.js');

const server = express();

server.use(helmet());
server.use(express.json());

server.use('/api/schemes', SchemeRouter);

module.exports = server;