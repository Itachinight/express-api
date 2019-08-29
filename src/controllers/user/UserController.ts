import {NextFunction, Request, Response} from "express";
import {BadRequest} from "http-errors";
import User from "../../models/User";

export default class UserController {
    public static async createUser(req: Request, res: Response, next: NextFunction) {
        const {name, surname, email, login, password} = req.body;

        try {
            const {id} = await User
                .create({name, surname, login, password, email})
                .save();

            res.status(201);
            res.send({id, name, surname, email, login})
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }
}