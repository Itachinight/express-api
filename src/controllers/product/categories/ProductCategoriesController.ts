import {Request, Response, NextFunction} from "express";
import {BadRequest, NotFound} from "http-errors";
import Category from "../../../models/Category";
import Product from "../../../models/Product";
import {createQueryBuilder} from "typeorm";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";

export default class ProductCategoriesController {

    public static async getList(req: Request, res: Response, next: NextFunction) {
        const {productId} = req.params;

        try {
            const product: Product = await Product.findOneOrFail(productId);
            const categories: Category[] = await Product.createQueryBuilder()
                .relation('categories')
                .of(product)
                .loadMany();

            res.send(categories);
        } catch (err) {
            console.log(err);
            if (err instanceof EntityNotFoundError) {
                next(new NotFound());
            } else next(new BadRequest());
        }
    }

    public static async createItem(req: Request, res: Response, next: NextFunction) {
        const {productId} = req.params;
        const {categoryId} = req.body;
        try {
            const product: Product = await Product.findOneOrFail(productId);
            await createQueryBuilder(Product)
                .relation('categories')
                .of(product)
                .add(categoryId);

            res.sendStatus(201);
        } catch (err) {
            console.log(err);
            if (err instanceof EntityNotFoundError) {
                next(new NotFound());
            } else next(new BadRequest());
        }
    }

    public static async deleteItem(req: Request, res: Response, next: NextFunction) {
        const {productId, categoryId} = req.params;

        try {
            await Product.createQueryBuilder()
                .relation('categories')
                .of(productId)
                .remove(categoryId);

            res.sendStatus(204);
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }
}