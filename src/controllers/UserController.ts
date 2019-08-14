import {NextFunction, Request, Response} from "express";
import BaseController from "./BaseController";
import {BadRequest} from "http-errors";
import UserModel from "../models/UserModel";
import User from "../entities/User";
import {parseId} from "../utils/helper";
import CartModel from "../models/CartModel";
import UserCart from "../entities/UserCart";

export default class UserController extends BaseController{
    private readonly userModel: UserModel;
    private readonly cartModel :CartModel;

    constructor() {
        super();
        this.userModel = new UserModel();
        this.cartModel = new CartModel();
    }

    protected setRoutes(): void {

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: User = await this.userModel.createUser(req.body);
                res.send(user);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.get('/:id/cart', async (req: Request, res: Response, next: NextFunction) => {
            const id = parseId(req);

            try {
                const cart: UserCart[] = await this.cartModel.getUserCartById(id);
                const total: number = CartModel.getUserCartTotal(cart);
                res.send({cart, total});
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.post('/:id/cart', async (req: Request, res: Response, next: NextFunction) => {
            const userId = parseId(req);
            const {productId, quantity} = req.body;

            try {
                await this.cartModel.addProductToCartById(userId, productId, quantity);
                res.sendStatus(201);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.put('/:id/cart', async (req: Request, res: Response, next: NextFunction) => {
            const userId = parseId(req);
            const {productId, quantity} = req.body;

            try {
                await this.cartModel.updateProductFormCartById(userId, productId, quantity);
                res.sendStatus(204);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.delete('/:id/cart', async (req: Request, res: Response, next: NextFunction) => {
            const userId = parseId(req);
            const {productId} = req.body;

            try {
                await this.cartModel.deleteProductFormCartById(userId, productId);
                res.sendStatus(204);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });
    }
}