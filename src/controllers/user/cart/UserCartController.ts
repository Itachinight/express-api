import {NextFunction, Request, Response} from "express";
import {BadRequest, NotFound} from "http-errors";
import UserCart from "../../../models/UserCart";
import CartService from "../../../services/CartService";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";

export default class UserCartController {

    public static async getUserCart(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.params;

        try {
            const cart: UserCart[] = await CartService.getUserCart(userId);
            const total: number = CartService.getUserCartTotal(cart);

            res.send({cart, total});
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    public static async addProductToCart(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.params;
        const {productId, quantity} = req.body;

        try {
            await UserCart.createQueryBuilder()
                .insert()
                .values({productId, userId, quantity})
                .execute();

            const {product, payStatus, updated} = await CartService.getUserCartProduct(userId, productId);

            res.status(201);
            res.send({userId, quantity, payStatus, updated, product});
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    public static async getCartProductById(req: Request, res: Response, next: NextFunction) {
        const {userId, productId} = req.params;

        try {
            const {quantity, product, payStatus} = await CartService.getUserCartProduct(userId, productId);

            res.status(201);
            res.send({userId, quantity, payStatus, product});
        } catch (err) {
            console.log(err);
            if (err instanceof EntityNotFoundError) {
                next(new NotFound());
            } else next(new BadRequest());
        }
    }

    public static async updateCartProductById(req: Request, res: Response, next: NextFunction) {
        const {userId, productId} = req.params;
        const {quantity} = req.body;

        try {
            const {raw} = await UserCart.update(
                {
                    userId,
                    productId
                },
                {
                    quantity
                });

            if (raw.affectedRows === 0) next(new NotFound());

            const {product, payStatus} = await CartService.getUserCartProduct(userId, productId);
            res.send({userId, quantity, payStatus, product});
        } catch (err) {
            console.log(err);
            if (err instanceof EntityNotFoundError) {
                next(new NotFound());
            } else next(new BadRequest());
        }
    }

    public static async deleteCartProductById(req: Request, res: Response, next: NextFunction) {
        const {userId, productId} = req.params;

        const {raw} = await UserCart.delete({userId, productId});

        if (raw.affectedRows === 0) {
            next(new NotFound());
        } else res.sendStatus(204);
    }
}