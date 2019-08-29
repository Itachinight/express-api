import {HttpError, NotFound} from "http-errors";
import {NextFunction, Request, Response} from "express";

export function passNotFound(req: Request, res: Response, next: NextFunction): void {
    next(new NotFound());
}

export function handleError(err: HttpError, req: Request, res: Response, next: NextFunction): void {
    res.status(err.status || 500);
    res.send(err.message);
}