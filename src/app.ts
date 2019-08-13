import * as express from 'express';
import {Request, Response, NextFunction, Application} from "express";
import * as dotEnv from 'dotenv';
import 'reflect-metadata';
import {createConnection, Connection} from 'typeorm';
import {HttpError, NotFound} from "http-errors";
import AttributeController from "./controllers/AttributeController";
import CategoryController from './controllers/CategoryController';
import ProductController from './controllers/ProductController';
import UserController from "./controllers/UserController";
import AuthController from "./controllers/AuthController";
import {parseToken} from "./utils/tokenGenerator";

dotEnv.config();
const connection: Promise<Connection> = createConnection();
const port: number = parseInt(process.env.DEV_PORT, 10);

connection.then(async (connection: Connection) => {
    const app: Application = express();

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    const attributeController: AttributeController = new AttributeController();
    const categoryController: CategoryController = new CategoryController();
    const productController: ProductController = new ProductController();
    const userController: UserController = new UserController();
    const authController: AuthController = new AuthController();

    app.use('/api/v1/auth', authController.router);

    app.use(parseToken);
    app.use('/api/v1/attributes', attributeController.router);
    app.use('/api/v1/categories', categoryController.router);
    app.use('/api/v1/products', productController.router);
    app.use('/api/v1/users', userController.router);

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
TODO carts + payment options
 */