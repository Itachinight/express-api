import {Response, Request, NextFunction, Router} from 'express';
import {NotFound, BadRequest} from 'http-errors';
import Category from "../entities/Category";
import Product from "../entities/Product";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";
import CategoryModel from "../models/CategoryModel";
import {getProductsByCategoryId} from "../models/productModel";
import {parseId} from "../utils/helper";

export default class CategoryController {
    public router: Router;
    private readonly categoryModel: CategoryModel;

    constructor() {
        this.router = Router();
        this.categoryModel = new CategoryModel();
        this.setRoutes();
    }

    setRoutes() {
        this.router.get('/:id/products', async (req: Request, res: Response) => {
            const id: number = parseId(req);
            const products: Product[] = await getProductsByCategoryId(id);

            res.send(products);
        });

        this.router.get('/', async (req: Request, res: Response) => {
            const categories: Category[] = await this.categoryModel.getCategories();
            res.send(categories);
        });

        this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);

            try {
                const category: Category = await this.categoryModel.getCategoryById(id);
                res.send(category);
            } catch (err) {
                console.log(err);
                next(new NotFound());
            }
        });

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const category: Category = await this.categoryModel.createCategory(req.body);
                res.send(category);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {name, description} = req.body;

            try {
                const category: Category = await this.categoryModel.updateCategoryById(id, {name, description});
                res.send(category);
            } catch (err) {
                console.log(err);
                if (err instanceof EntityNotFoundError) {
                    next(new NotFound());
                } else {
                    next(new BadRequest());
                }
            }
        });

        this.router.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {affected} = await this.categoryModel.deleteCategoryById(id);

            if (affected >= 1) {
                res.sendStatus(204);
            } else {
                next(new NotFound());
            }
        });
    }
}