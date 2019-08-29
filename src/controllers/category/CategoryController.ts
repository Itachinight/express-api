import {Response, Request, NextFunction} from 'express';
import {NotFound, BadRequest} from 'http-errors';
import Category from "../../models/Category";
import Product from "../../models/Product";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";

export default class CategoryController {

    static async getItem(req: Request, res: Response, next: NextFunction) {
        const {categoryId} = req.params;

        try {
            const category: Category = await Category.findOneOrFail(categoryId);

            res.send(category);
        } catch (err) {
            console.log(err);
            next(new NotFound());
        }
    }

    static async getList(req: Request, res: Response) {
        const categories: Category[] = await Category.find();

        res.send(categories);
    }

    static async createItem(req: Request, res: Response, next: NextFunction) {
        const {name, description} = req.body;
        
        try {
            const category: Category = await Category.create({name, description});

            res.send(await Category.save(category));
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    static async updateItem(req: Request, res: Response, next: NextFunction) {
        const {categoryId} = req.params;
        const {name, description} = req.body;

        try {
            const category: Category = await Category.findOneOrFail(categoryId);
            Category.merge(category, {name, description});

            res.send(await Category.save(category));
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
        const {categoryId} = req.params;
        const {affected} = await Category.delete(categoryId);

        if (affected === 0) {
            next(new NotFound());
        } else res.sendStatus(204);
    }

    static async getProductsByCategoryId(req: Request, res: Response, next: NextFunction) {
        const {categoryId} = req.params;

        const [products, quantity] = await Product.createQueryBuilder('products')
            .innerJoin('products.categories', 'categories')
            .where("categories.id = :categoryId" ,{categoryId})
            .getManyAndCount();

        res.send({products, quantity});
    }
}