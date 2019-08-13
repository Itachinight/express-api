import {Request, Response, NextFunction, Router} from "express";
import Attribute from "../entities/Attribute";
import AttributeModel from "../models/AttributeModel";
import {BadRequest, NotFound} from "http-errors";
import {parseId} from "../utils/helper";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";
import BaseController from "./BaseController";

export default class AttributeController extends BaseController{
    private readonly attributeModel: AttributeModel;

    constructor() {
        super();
        this.attributeModel = new AttributeModel();
    }

    protected setRoutes(): void {

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            res.send(await this.attributeModel.getAttributes());
        });

        this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);

            try {
                const attribute: Attribute = await this.attributeModel.getAttributeById(id);
                res.send(attribute);
            } catch (err) {
                console.log(err);
                next(new NotFound);
            }
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            const {name} = req.body;

            try {
                const attribute: Attribute = await this.attributeModel.createAttribute({name});
                res.send(attribute);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {name} = req.body;

            try {
                const attribute: Attribute = await this.attributeModel.updateAttributeById(id,{name});
                res.send(attribute);
            } catch (err) {
                console.log(err);
                if (err instanceof EntityNotFoundError) {
                    next(new NotFound());
                } else next(new BadRequest());
            }
        });

        this.router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {affected} = await this.attributeModel.deleteAttributeById(id);

            if (affected >= 1) {
                res.sendStatus(204);
            } else {
                next(new NotFound());
            }
        });
    }
}