import {NextFunction, Request, Response} from "express";
import {BadRequest} from "http-errors";
import Admin from "../../models/Admin";
import UserCart from "../../models/UserCart";

export default class AdminController {

    public static async createAdmin(req: Request, res: Response, next: NextFunction) {
        const {name, surname, email, login, password} = req.body;

        try {
            const {id} = await Admin
                .create({email, login, password, surname, name})
                .save();

            res.status(201);
            res.send({id, name, surname, email, login});
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    public static async checkoutUserCart(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.params;

        try {
            const {raw} = await UserCart.createQueryBuilder()
                .update()
                .set({payStatus: true})
                .where('userId = :userId', {userId})
                .execute();

            res.send(raw);
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }
}