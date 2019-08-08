import * as express from 'express';
import {Request, Response, NextFunction, Application} from "express";
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import {createConnection, Connection} from 'typeorm';
import productsRouter from './products/router';
import categoriesRouter from "./categories/router";
import {HttpError, NotFound} from "http-errors";
dotenv.config();

const port: number = parseInt(process.env.DEV_PORT, 10);
const connection: Promise<Connection> = createConnection();

connection.then(async connection => {
    const app: Application = express();

    app.use(express.urlencoded({extended: true}));

    app.use('/api/v1/categories', categoriesRouter);
    app.use('/api/v1/products', productsRouter);

    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFound());
    });

    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(err.status || 500);
    });

    app.listen(port, () => {
        console.log(`Server started on ${port}`);
    });

}).catch(err => console.log(err));


/*
TODO products selection
TODO users
TODO carts + payment options
 */