import {Request, Response, NextFunction} from "express";
import Attribute from "../../models/Attribute";
import {BadRequest, NotFound} from "http-errors";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";

export default class AttributeController{

    static async getItem(req: Request, res: Response, next: NextFunction) {
        const {attributeId} = req.params;

        try {
            const attribute: Attribute = await Attribute.findOneOrFail(attributeId);

            res.send(attribute);
        } catch (err) {
            console.log(err);
            next(new NotFound());
        }
    }

    public static async getList(req: Request, res: Response, next: NextFunction) {
        const attributes: Attribute[] = await Attribute.find();

        res.send(attributes);
    }

    static async createItem(req: Request, res: Response, next: NextFunction) {
        const {name} = req.body;

        try {
            const attribute: Attribute = await Attribute.create({name});

            res.send(await Attribute.save(attribute));
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    static async updateItem(req: Request, res: Response, next: NextFunction) {
        const {attributeId} = req.params;
        const {name} = req.body;

        try {
            const attribute: Attribute = await Attribute.findOneOrFail(attributeId);
            Attribute.merge(attribute, {name});

            res.send(await Attribute.save(attribute));
        } catch (err) {
            console.log(err);
            if (err instanceof EntityNotFoundError) {
                next(new NotFound());
            } else {
                next(new BadRequest());
            }
        }
    }

    static async deleteItem(req: Request, res: Response, next: NextFunction) {
        const {attributeId} = req.params;
        const {affected} = await Attribute.delete(attributeId);

        if (affected === 0) {
            next(new NotFound());
        } else res.sendStatus(204);
    }
}