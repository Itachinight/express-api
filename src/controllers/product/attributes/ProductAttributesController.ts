import {Request, Response, NextFunction} from "express";
import {NotFound, BadRequest} from "http-errors"
import ProductAttribute from "../../../models/ProductAttribute";
import ProductAttributeService from "../../../services/ProductAttributeService";
import Product from "../../../models/Product";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";

export default class ProductAttributesController {

    public static async getItem(req: Request, res: Response, next: NextFunction) {
        const {productId, attributeId} = req.params;

        try {
            const attributeValue: ProductAttribute = await ProductAttributeService
                .getProductAttributeValue(productId, attributeId);

            if (!attributeValue) return next(new NotFound());

            ProductAttributeService.assignAttributeNameToValue(attributeValue);

            res.send(attributeValue);
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    public static async getList(req: Request, res: Response, next: NextFunction) {
        const {productId} = req.params;

        try {
            const {id} = await Product.findOneOrFail(productId);

            const attributeValues: ProductAttribute[] = await ProductAttribute
                .createQueryBuilder('values')
                .where('productId = :id', {id})
                .leftJoinAndSelect('values.attribute', 'attribute')
                .getMany();

            for (const attributeValue of attributeValues) {
                ProductAttributeService.assignAttributeNameToValue(attributeValue);
            }

            res.send(attributeValues);
        } catch (err) {
            console.log(err);
            next(new NotFound());
        }
    }

    public static async createItem(req: Request, res: Response, next: NextFunction) {
        const {productId} = req.params;
        const {attributeId, value} = req.body;

        try {
            await ProductAttribute.createQueryBuilder()
                .insert()
                .values({productId, attributeId, value})
                .execute();

            const attributeValue: ProductAttribute = await ProductAttributeService
                .getProductAttributeValue(productId, attributeId);

            ProductAttributeService.assignAttributeNameToValue(attributeValue);

            res.status(201);
            res.send(attributeValue);
        } catch (err) {
            console.log(err);
            if (err instanceof EntityNotFoundError) {
                next(new NotFound());
            } else next(new BadRequest());
        }
    }

    public static async updateItem(req: Request, res: Response, next: NextFunction) {
        const {productId, attributeId} = req.params;
        const {value} = req.body;

        try {
            const {raw} = await ProductAttribute.createQueryBuilder()
                .update()
                .set({value})
                .where('productId = :productId', {productId})
                .andWhere('attributeId = :attributeId', {attributeId})
                .execute();

            const attributeValue: ProductAttribute = await ProductAttributeService
                .getProductAttributeValue(productId, attributeId);

            ProductAttributeService.assignAttributeNameToValue(attributeValue);

            res.send(attributeValue);
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    public static async deleteItem(req: Request, res: Response, next: NextFunction) {
        const {productId, attributeId} = req.params;

        try {
            const {affected} = await ProductAttribute.createQueryBuilder()
                .delete()
                .where('productId = :productId', {productId})
                .andWhere('attributeId = :attributeId', {attributeId})
                .execute();

            if (affected > 0) {
                res.sendStatus(204);
            } else next(new NotFound());
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }
}