import BaseController from "./BaseController";
import {NextFunction, Request, Response} from "express";
import UserModel from "../models/UserModel";
import {verifyPassword} from "../utils/passwordHasher";
import User from "../entities/User";
import {createToken} from "../utils/tokenGenerator";

export default class AuthController extends BaseController {
    private readonly userModel: UserModel;

    constructor() {
        super();
        this.userModel = new UserModel();
    }

    protected setRoutes(): void {
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            const {login, password} = req.body;

            try {
                const user: User = await this.userModel.getUserByLogin(login);
                const {password: hashedPassword} = user;
                if (await verifyPassword(password, hashedPassword)) {
                    delete user.password;
                    return res.send({
                        token: await createToken(JSON.parse(JSON.stringify(user)))
                    });
                } else res.sendStatus(400);
            } catch (err) {
                console.log(err);
                res.sendStatus(400);
            }
        });
    }

}