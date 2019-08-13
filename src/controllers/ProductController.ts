import {Response, Request, NextFunction} from 'express';
import {EntityNotFoundError} from 'typeorm/error/EntityNotFoundError'
import {NotFound, BadRequest} from 'http-errors';
import Product from '../entities/Product';
import Category from '../entities/Category';
import ProductModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";
import ProductAttributeValueModel from '../models/ProductAttributeValueModel';
import ProductAttributeValue from "../entities/ProductAttributeValue";
import {allowForAdmin, parseId} from "../utils/helper";
import BaseController from "./BaseController";

export default class ProductController extends BaseController{
    private readonly productModel: ProductModel;
    private readonly productAttributeValueModel: ProductAttributeValueModel;

    constructor() {
        super();
        this.productModel = new ProductModel();
        this.productAttributeValueModel = new ProductAttributeValueModel();
    }

    protected setRoutes(): void {

        this.router.get('/:id/attributes', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);

            try {
                await this.productModel.checkProductPresence(id);
                const values: ProductAttributeValue[] = await this.productAttributeValueModel
                    .getProductAttributeValues(id);
                res.send(values);
            } catch (err) {
                console.log(err);
                next(new NotFound());
            }
        });

        this.router.post('/:id/attributes', allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
            const productId: number = parseId(req);
            const {attributeId, value} = req.body;

            try {
                await this.productModel.checkProductPresence(productId);
                await this.productAttributeValueModel.addProductAttributeValue(productId, attributeId, value);
                const attributeValue: Promise<ProductAttributeValue> = this.productAttributeValueModel
                    .getProductAttributeValueById(productId, attributeId);
                res.send(await attributeValue);
            } catch (err) {
                console.log(err);
                if (err instanceof EntityNotFoundError) {
                    next(new NotFound());
                } else {
                    next(new BadRequest());
                }
            }
        });

        this.router.delete('/:id/attributes', allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
            const productId: number = parseId(req);
            const {attributeId} = req.body;

            try {
                await this.productModel.checkProductPresence(productId);
                const {affected} = await this.productAttributeValueModel
                    .deleteProductAttributeValue(productId, attributeId);

                if (affected >= 1) {
                    res.sendStatus(204);
                } else next(new NotFound());
            } catch (err) {
                console.log(err);
                next(new NotFound());
            }
        });

        this.router.get('/:id/categories', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);

            try {
                await this.productModel.checkProductPresence(id);
                const productCategories: Category[] = await CategoryModel.getCategoriesByProductId(id);
                res.send(productCategories);
            } catch (err) {
                console.log(err);
                next(new NotFound());
            }
        });

        this.router.post('/:id/categories', allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {categories} = req.body;

            try {
                await this.productModel.checkProductPresence(id);
                await CategoryModel.addCategoriesToProduct(id, categories);
                res.sendStatus(201);
            } catch (err) {
                console.log(err);
                if (err instanceof EntityNotFoundError) {
                    next(new NotFound());
                } else {
                    next(new BadRequest());
                }
            }
        });

        this.router.delete('/:id/categories', allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {categories} = req.body;

            try {
                await this.productModel.checkProductPresence(id);
                await CategoryModel.deleteCategoriesFromProduct(id, categories);
                res.sendStatus(204);
            } catch (err) {
                console.log(err);
                if (err instanceof EntityNotFoundError) {
                    next(new NotFound());
                } else {
                    next(new BadRequest());
                }
            }
        });

        this.router.get('/', async (req: Request, res: Response) => {
            const products = await this.productModel.getProducts(req.query);
            res.send(products);
        });

        this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);

            try {
                const product: Product = await this.productModel.getProductById(id);
                res.send(product);
            } catch (err) {
                console.log(err);
                next(new NotFound());
            }
        });

        this.router.post('/', allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const product: Product = await this.productModel.createProduct(req.body);
                res.status(201);
                res.send(product);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.put('/:id', allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {name, price, description, manufacturer} = req.body;
            const productParams: ProductFieldsInterface = {};

            if (name) productParams.name = name;
            if (price) productParams.price = parseFloat(price);
            if (description) productParams.description = description;
            if (manufacturer) productParams.manufacturer = manufacturer;

            try {
                const product: Product = await this.productModel.updateProductById(id, productParams);
                res.send(product);
            } catch (err) {
                console.log(err);
                if (err instanceof EntityNotFoundError) {
                    next(new NotFound());
                } else {
                    next(new BadRequest());
                }
            }
        });

        this.router.delete('/:id', allowForAdmin, async(req: Request, res: Response, next: NextFunction) => {
            const id: number = parseId(req);
            const {affected} = await this.productModel.deleteProductById(id);

            if (affected >= 1) {
                res.sendStatus(204);
            } else {
                next(new NotFound());
            }
        });
    }
}