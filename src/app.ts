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
import AdminController from "./controllers/AdminController";
import {verifyToken} from "./utils/tokenGenerator";
import categoryRouter from "./routes/categoryRouter";

dotEnv.config();

(async () => {
    const connection: Connection = await createConnection();
    const port: number = parseInt(process.env.DEV_PORT, 10);

    const app: Application = express();

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    const attributeController: AttributeController = new AttributeController();
    const productController: ProductController = new ProductController();
    const userController: UserController = new UserController();
    const authController: AuthController = new AuthController();
    const adminController: AdminController  = new AdminController();

    app.use('/api/v1/auth', authController.router);

    app.use(verifyToken);
    app.use('/api/v1/admins', adminController.router);
    app.use('/api/v1/attributes', attributeController.router);
    app.use('/api/v1/categories', categoryRouter);
    app.use('/api/v1/products', productController.router);
    app.use('/api/v1/users', userController.router);

    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFound());
    });

    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(err.status || 500);
    });

    app.listen(port, () => console.log(`Server started on ${port}`));
})();