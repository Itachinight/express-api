import {Response, Request, NextFunction} from 'express';
import {NotFound, BadRequest} from 'http-errors';
import Category from "../entities/Category";
import Product from "../entities/Product";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";
import {getRepository, Repository} from "typeorm";
import ProductCategoryService from "../services/ProductCategoryService";

export default class CategoryController {
    static repository: Repository<Category> = getRepository(Category);

    static async getItem(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        try {
            const category: Category = await await CategoryController.repository.findOneOrFail(id);

            res.send(category);
        } catch (err) {
            console.log(err);
            next(new NotFound());
        }
    }

    static async getList(req: Request, res: Response) {
        const categories: Category[] = await CategoryController.repository.find();

        res.send(categories);
    }

    static async createItem(req: Request, res: Response, next: NextFunction) {
        try {
            const category: Category[] = await CategoryController.repository.create(req.body);

            res.send(await CategoryController.repository.save(category));
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    static async updateItem(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;
        const {name, description} = req.body;

        try {
            const category: Category = await await CategoryController.repository.findOneOrFail(id);
            CategoryController.repository.merge(category, {name, description});

            res.send(await CategoryController.repository.save(category));
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
        const {id} = req.params;
        const {affected} = await CategoryController.repository.delete(id);

        if (affected >= 1) {
            res.sendStatus(204);
        } else {
            next(new NotFound());
        }
    }

    static async getProductsByCategoryId(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;
        const products: Product[] = await ProductCategoryService.getProductsByCategoryId(id);

        res.send(products);
    }
}