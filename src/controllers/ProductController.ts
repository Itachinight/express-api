import {Response, Request, NextFunction} from 'express';
import {EntityNotFoundError} from 'typeorm/error/EntityNotFoundError'
import {NotFound, BadRequest} from 'http-errors';
import Product from '../entities/Product';
import Category from '../entities/Category';
import ProductModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";
import ProductAttributeValueModel from '../models/ProductAttributeValueModel';
import ProductAttributeValue from "../entities/ProductAttributeValue";
import {allowForAdmin} from "../utils/helper";
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
        this.router.route('/')
            .get(async (req: Request, res: Response) => {
                const products = await this.productModel.getProducts(req.query);
                res.send(products);
            })
            .post(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const product: Product = await this.productModel.createProduct(req.body);
                    res.status(201);
                    res.send(product);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            });

        this.router.route('/:id')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;

                try {
                    const product: Product = await this.productModel.getProductById(id);
                    res.send(product);
                } catch (err) {
                    console.log(err);
                    next(new NotFound());
                }
            })
            .put(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;
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
            })
            .delete(allowForAdmin, async(req: Request, res: Response, next: NextFunction) => {
                const {id} = req.params;
                const {affected} = await this.productModel.deleteProductById(id);

                if (affected >= 1) {
                    res.sendStatus(204);
                } else {
                    next(new NotFound());
                }
            });

        this.router.route('/:productId/attributes')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {productId} = req.params;

                try {
                    await this.productModel.checkProductPresence(productId);
                    const values: ProductAttributeValue[] = await this.productAttributeValueModel
                        .getProductAttributeValues(productId);
                    res.send(values);
                } catch (err) {
                    console.log(err);
                    next(new NotFound());
                }
            })
            .post(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {productId} = req.params;
                const {attributeId, value} = req.body;

                try {
                    await this.productModel.checkProductPresence(productId);
                    await this.productAttributeValueModel.addProductAttributeValue(productId, attributeId, value);
                    const attributeValue: ProductAttributeValue = await this.productAttributeValueModel
                        .getProductAttributeValueById(productId, attributeId);

                    res.status(201);
                    res.send(attributeValue);
                } catch (err) {
                    console.log(err);
                    if (err instanceof EntityNotFoundError) {
                        next(new NotFound());
                    } else {
                        next(new BadRequest());
                    }
                }
            });


        this.router.route('/:productId/attributes/:attributeId')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {productId, attributeId} = req.params;

                try {
                    const attributeValue: ProductAttributeValue = await this.productAttributeValueModel
                        .getProductAttributeValueById(productId, attributeId);
                    res.send(attributeValue);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            })
            .put(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {productId, attributeId} = req.params;
                const {value} = req.body;

                try {
                    await this.productAttributeValueModel.updateProductAttributeValueById(productId, attributeId, value);
                    const attributeValue: ProductAttributeValue = await this.productAttributeValueModel
                        .getProductAttributeValueById(productId, attributeId);

                    res.status(201);
                    res.send(attributeValue);
                } catch (err) {
                    console.log(err);
                    next(new BadRequest());
                }
            })
            .delete(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {productId, attributeId} = req.params;

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

        this.router.route('/:productId/categories')
            .get(async (req: Request, res: Response, next: NextFunction) => {
                const {productId} = req.params;

                try {
                    await this.productModel.checkProductPresence(productId);
                    const productCategories: Category[] = await CategoryModel.getCategoriesByProductId(productId);
                    res.send(productCategories);
                } catch (err) {
                    console.log(err);
                    next(new NotFound());
                }
            })
            .post(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {productId} = req.params;
                const {categories} = req.body;

                try {
                    await this.productModel.checkProductPresence(productId);
                    await CategoryModel.addCategoriesToProduct(productId, categories);
                    res.sendStatus(201);
                } catch (err) {
                    console.log(err);
                    if (err instanceof EntityNotFoundError) {
                        next(new NotFound());
                    } else {
                        next(new BadRequest());
                    }
                }
            })
            .delete(allowForAdmin, async (req: Request, res: Response, next: NextFunction) => {
                const {productId} = req.params;
                const {categories} = req.body;

                try {
                    await this.productModel.checkProductPresence(productId);
                    await CategoryModel.deleteCategoriesFromProduct(productId, categories);
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
    }
}