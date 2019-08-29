import {NextFunction, Request, Response} from "express";
import AuthService from "../../services/AuthService";
import User from "../../models/User";
import Admin from "../../models/Admin";
import {Unauthorized} from 'http-errors';

export default class AuthController {
    static async loginUser(req: Request, res: Response, next: NextFunction) {
        const {login, password} = req.body;

        try {
            const {password: hashedPassword, ...user} = await User.findOneOrFail({where: {login}});
            if (await AuthService.verifyPassword(password, hashedPassword)) {
                res.send({
                    login,
                    token: await AuthService.createToken(user),
                });
            } else next(new Unauthorized());
        } catch (err) {
            console.log(err);
            next(new Unauthorized());
        }
    }

    static async loginAdmin(req: Request, res: Response, next: NextFunction) {
        const {login, password} = req.body;

        try {
            const {password: hashedPassword, ...admin} = await Admin.findOneOrFail({where: {login}});
            if (await AuthService.verifyPassword(password, hashedPassword)) {
                res.send({
                    login,
                    token: await AuthService.createToken(admin),
                });
            } next(new Unauthorized());
        } catch (err) {
            console.log(err);
            next(new Unauthorized());
        }
    }
}