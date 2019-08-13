import {NextFunction, Request, Response} from "express";
import BaseController from "./BaseController";
import {BadRequest, NotFound} from "http-errors";
import UserModel from "../models/UserModel";
import User from "../entities/User";

export default class UserController extends BaseController{
    private readonly userModel: UserModel;

    constructor() {
        super();
        this.userModel = new UserModel();
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
    }
}