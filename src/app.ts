import * as express from 'express';
import {Request, Response, NextFunction} from "express";
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import {createConnection, Connection} from 'typeorm';
import productRouter from './products/router';
import {HttpError, NotFound} from "http-errors";
dotenv.config();

const port: number = parseInt(process.env.DEV_PORT, 10);
const connection: Promise<Connection> = createConnection();

connection.then(async connection => {
    const app: express.Application = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/products', productRouter);
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFound());
    });
    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500);
        res.send();
    });

    app.listen(port, () => {
        console.log(`Server started on ${port}`);
    });

}).catch(err => console.log(err));