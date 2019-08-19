import {Response, Request, NextFunction} from 'express';
import {NotFound, BadRequest} from 'http-errors';
import Category from "../entities/Category";
import Product from "../entities/Product";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";
import CategoryModel from "../models/CategoryModel";
import ProductModel from "../models/ProductModel";
import {allowForAdmin} from "../utils/helper";
import BaseController from "./BaseController";

export default class CategoryController extends BaseController{
    private readonly categoryModel: CategoryModel;

    constructor() {
        super();
        this.categoryModel = new CategoryModel();
    }

    protected setRoutes(): void {

        this.router.route('/')
            .get(async (req: Request, res: Response) => {
                const categories: Category[] = await this.categoryModel.getCategories();
                res.send(categories);
            })
            .post(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const category: Category = await this.categoryModel.createCategory(req.body);
                    res.send(category);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            });

        this.router.route('/:id')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;

                try {
                    const category: Category = await this.categoryModel.getCategoryById(id);
                    res.send(category);
                } catch (err) {
                    console.log(err);
                    next(new NotFound());
                }
            })
            .put(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;
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
            })
            .delete(allowForAdmin, async(req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;

                const {affected} = await this.categoryModel.deleteCategoryById(id);

                if (affected >= 1) {
                    res.sendStatus(204);
                } else {
                    next(new NotFound());
                }
            });

        this.router.get('/:id/products', async (req: Request, res: Response) => {
            const {id} = req.params;
            const products: Product[] = await ProductModel.getProductsByCategoryId(id);

            res.send(products);
        });

    }
}