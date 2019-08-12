import {Request} from "express";

export const parseId = (req: Request): number => {
    return parseInt(req.params.id, 10);
};