import {NextFunction, Request, Response} from "express";
import BaseController from "./BaseController";
import {BadRequest, NotFound} from "http-errors";
import UserModel from "../models/UserModel";
import User from "../entities/User";
import CartModel from "../models/CartModel";
import UserCart from "../entities/UserCart";
import {validateUserRequest} from "../utils/helper";

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

        this.router.route('/:userId/cart')
            .all(validateUserRequest)
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {userId} = req.params;

                try {
                    const cart: UserCart[] = await this.cartModel.getUserCartById(userId);
                    const total: number = CartModel.getUserCartTotal(cart);
                    res.send({cart, total});
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            })
            .post(async (req: Request, res: Response, next: NextFunction) => {
                const {userId} = req.params;

                const {productId, quantity} = req.body;

                try {
                    await this.cartModel.addProductToCartById(userId, productId, quantity);
                    res.sendStatus(201);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            });

        this.router.route('/:userId/cart/:productId')
            .all(validateUserRequest)
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {userId, productId} = req.params;

                try {
                    const cartProduct: UserCart = await this.cartModel.getUserCartProductById(userId, productId);
                    if (!cartProduct) return next(new NotFound());
                    res.send(cartProduct);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            })
            .put(async (req: Request, res: Response, next: NextFunction) => {
                const {userId, productId} = req.params;
                const {quantity} = req.body;

                try {
                    await this.cartModel.updateProductFormCartById(userId, productId, quantity);
                    res.sendStatus(204);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            })
            .delete(async (req: Request, res: Response, next: NextFunction) => {
                const {userId, productId} = req.params;

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