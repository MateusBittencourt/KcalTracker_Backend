import { createServer } from 'http';
import express, { json } from "express";
import { initialize } from "@oas-tools/core";
import 'dotenv/config'
const app = express();

app.use(json());
const serverPort = process.env.PORT;

initialize(app).then(() => {
    createServer(app).listen(serverPort, () => console.dir(`Server started on port ${serverPort}!`));
})