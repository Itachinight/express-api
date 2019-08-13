import {NextFunction, Request, Response} from "express";

export const parseId = (req: Request): number => {
    return parseInt(req.params.id, 10);
};

export const allowForAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === 'admin') {
        next();
    } else res.sendStatus(401);
};

export const allowForRegistered = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.role) return res.sendStatus(401);
    next();
};