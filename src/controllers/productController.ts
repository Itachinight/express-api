import {Response, Request, Router, NextFunction} from 'express';
import {EntityNotFoundError} from 'typeorm/error/EntityNotFoundError'
import {NotFound, BadRequest} from 'http-errors';
import Product from '../entities/Product';
import Category from '../entities/Category';
import {
    checkProductPresence,
    createProduct,
    deleteProductById,
    getProductById,
    getProducts,
    updateProductById
} from "../models/productModel";
import CategoryModel from "../models/CategoryModel";
import {
    addProductAttributeValue,
    deleteProductAttributeValue,
    getProductAttributeValueById,
    getProductAttributeValues
} from '../models/attributeValueModel';
import ProductAttributeValue from "../entities/ProductAttributeValue";

const productController: Router = Router();

productController.get('/:id/attributes', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        await checkProductPresence(id);
        const values: ProductAttributeValue[] = await getProductAttributeValues(id);

        res.send(values);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

productController.post('/:id/attributes', async (req: Request, res: Response, next: NextFunction) => {
    const productId: number = parseInt(req.params.id, 10);
    const { attributeId, value } = req.body;

    console.log(value);

    try {
        await checkProductPresence(productId);
        await addProductAttributeValue(productId, attributeId, value);
        const attributeValue: ProductAttributeValue = await getProductAttributeValueById(productId, attributeId);

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

productController.delete('/:id/attributes', async (req: Request, res: Response, next: NextFunction) => {
    const productId: number = parseInt(req.params.id, 10);
    const { attributeId } = req.body;

    try {
        await checkProductPresence(productId);
        const {affected} = await deleteProductAttributeValue(productId, attributeId);

        if (affected >= 1) {
            res.sendStatus(204);
        } else next(new NotFound());
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

productController.get('/:id/categories', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        await checkProductPresence(id);
        const productCategories: Category[] = await CategoryModel.getCategoriesByProductId(id);
        res.send(productCategories);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

productController.post('/:id/categories', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);
    const {categories} = req.body;

    try {
        await checkProductPresence(id);
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

productController.delete('/:id/categories', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);
    const {categories} = req.body;

    try {
        await checkProductPresence(id);
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

productController.get('/', async (req: Request, res: Response) => {
    const {minPrice, maxPrice, name, manufacturer} = req.query;
    const queryParams: ProductSearchParams = {};

    if (minPrice) queryParams.minPrice = parseFloat(minPrice);
    if (maxPrice) queryParams.maxPrice = parseFloat(maxPrice);
    if (name) queryParams.name = name;
    if (manufacturer) queryParams.manufacturer = manufacturer;

    const products = await getProducts(queryParams);
    res.send(products);
});

productController.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const product: Product = await getProductById(id);
        res.send(product);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

productController.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product: Product = await createProduct(req.body);
        res.status(201);
        res.send(product);
    } catch (err) {
        console.log(err);
        next(new BadRequest());
    }
});

productController.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);
    const {name, price, description, manufacturer} = req.body;
    const productParams: ProductFieldsInterface = {};

    if (name) productParams.name = name;
    if (price) productParams.price = parseFloat(price);
    if (description) productParams.description = description;
    if (manufacturer) productParams.manufacturer = manufacturer;

    try {
        const product: Product = await updateProductById(id, productParams);
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

productController.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);
    const affectedRows = await deleteProductById(id);

    if (affectedRows >= 1) {
        res.sendStatus(204);
    } else {
        next(new NotFound());
    }
});

export default productController;