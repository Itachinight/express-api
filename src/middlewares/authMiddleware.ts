import {NextFunction, Request, Response} from "express";
import {verify as verifyJwt} from "jsonwebtoken";
import {Forbidden} from "http-errors";

export async function parseReqToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {authorization: jwt} = req.headers;

    try {
        const {id, name, surname, login, email} = <UserAuthInterface> await verifyJwt(jwt, process.env.JWT_SALT);
        req.user = {id, name, surname, login, email};
        next();
    } catch (err) {
        console.log(err);
        next(new Forbidden())
    }
}

export async function allowForAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.user.admin === true) {
        next();
    } else next(new Forbidden());
}

export async function validateUserRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {userId} = req.params;
    if (userId == req.user.id) {
        next();
    } else next(new Forbidden());
}