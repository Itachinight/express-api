import {NextFunction, Request, Response} from "express";
import {Forbidden} from "http-errors";

export const allowForAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.admin === true) {
        next();
    } else next(new Forbidden());
};

export const validateUserRequest = (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.params;
    if (userId == req.user.id) {
        next();
    } else next(new Forbidden());
};