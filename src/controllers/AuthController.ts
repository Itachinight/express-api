import BaseController from "./BaseController";
import {NextFunction, Request, Response} from "express";
import UserModel from "../models/UserModel";
import {verifyPassword} from "../utils/passwordHasher";
import User from "../entities/User";
import {createToken} from "../utils/tokenGenerator";
import AdminModel from "../models/AdminModel";
import Admin from "../entities/Admin";
import {Unauthorized} from 'http-errors';

export default class AuthController extends BaseController {
    private readonly userModel: UserModel;
    private readonly adminModel: AdminModel;

    constructor() {
        super();
        this.userModel = new UserModel();
        this.adminModel = new AdminModel();
    }

    protected setRoutes(): void {
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            const {login, password} = req.body;

            try {
                const user: User = await this.userModel.getUserByLogin(login);
                const {password: hashedPassword} = user;
                if (await verifyPassword(password, hashedPassword)) {
                    delete user.password;
                    res.send({
                        login,
                        token: await createToken(JSON.parse(JSON.stringify(user)))
                    });
                } else next(new Unauthorized());
            } catch (err) {
                console.log(err);
                next(new Unauthorized());
            }
        });

        this.router.post('/admin', async (req: Request, res: Response, next: NextFunction) => {
            const {login, password} = req.body;

            try {
                const admin: Admin = await this.adminModel.getAdminByLogin(login);
                const {password: hashedPassword} = admin;
                if (await verifyPassword(password, hashedPassword)) {
                    delete admin.password;
                    res.send({
                        login,
                        token: await createToken(JSON.parse(JSON.stringify(admin)))
                    });
                } next(new Unauthorized());
            } catch (err) {
                console.log(err);
                next(new Unauthorized());
            }
        });
    }

}