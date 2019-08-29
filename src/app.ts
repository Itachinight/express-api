import * as express from 'express';
import {Application} from "express";
import {config as dotEnvConfig} from 'dotenv';
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import router from "./routes/api/v1";
import {handleError, passNotFound} from "./middlewares/errorMiddleware";

dotEnvConfig();
createConnection().then(connection => {
    const port: number = parseInt(process.env.DEV_PORT, 10);
    const app: Application = express();

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use('/api/v1', router);
    app.use(passNotFound);
    app.use(handleError);

    app.listen(port, () => console.log(`Server started on ${port}`));
}).catch(err => {
    console.log(err);
    process.exit();
});