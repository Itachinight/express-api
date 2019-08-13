import {sign, SignOptions, verify} from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";

const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '2h'
};

export const createToken = async (payload: object): Promise<string> => {
    return sign(payload, process.env.JWT_SALT, options);
};

export const parseToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.user = <object> await verify(req.headers.authorization, process.env.JWT_SALT);
        next();
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
}