import {Request, Response, NextFunction} from "express";
import Attribute from "../entities/Attribute";
import AttributeModel from "../models/AttributeModel";
import {BadRequest, NotFound} from "http-errors";
import {allowForAdmin} from "../utils/helper";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";
import BaseController from "./BaseController";

export default class AttributeController extends BaseController{
    private readonly attributeModel: AttributeModel;

    constructor() {
        super();
        this.attributeModel = new AttributeModel();
    }

    protected setRoutes(): void {

        this.router.route('/')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                res.send(await this.attributeModel.getAttributes());
            })
            .post(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {name} = req.body;

                try {
                    const attribute: Attribute = await this.attributeModel.createAttribute({name});
                    res.send(attribute);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            });

        this.router.route('/:id')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;

                try {
                    const attribute: Attribute = await this.attributeModel.getAttributeById(id);
                    res.send(attribute);
                } catch (err) {
                    console.log(err);
                    next(new NotFound);
                }
            })
            .put(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;
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
            })
            .delete(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;

                const {affected} = await this.attributeModel.deleteAttributeById(id);

                if (affected >= 1) {
                    res.sendStatus(204);
                } else {
                    next(new NotFound());
                }
            });

    }
}