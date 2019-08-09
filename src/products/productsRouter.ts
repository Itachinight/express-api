import {Response, Request, Router, NextFunction} from 'express';
import {createQueryBuilder} from 'typeorm';
import {EntityNotFoundError} from 'typeorm/error/EntityNotFoundError'
import {NotFound, BadRequest} from 'http-errors';
import Product from '../entity/Product';
import Category from '../entity/Category';
import {createProduct, deleteProductById, getProductById, getProducts, updateProductById} from "./productModel";

const productsRouter: Router = Router();

productsRouter.get('/:id/categories', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const productCategories: Category[] = await createQueryBuilder()
        .relation(Product, 'categories')
        .of(id)
        .loadMany();

    res.send(productCategories);
});

productsRouter.post('/:id/categories', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);
    const {categories} = req.body;

    try {
        await createQueryBuilder()
            .relation(Product, 'categories')
            .of(id)
            .add(categories);

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        next(new BadRequest());
    }
});

productsRouter.get('/', async (req: Request, res: Response) => {
    const {minPrice, maxPrice, name, manufacturer} = req.query;
    const queryParams: ProductSearchParams = {};

    if(minPrice)
        queryParams.minPrice = parseFloat(minPrice);
    if(maxPrice)
        queryParams.maxPrice = parseFloat(maxPrice);
    if(name)
        queryParams.name = name;
    if(manufacturer)
        queryParams.manufacturer = manufacturer;

    const products = await getProducts(queryParams);

    res.send(products);
});

productsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const product: Product = await getProductById(id);
        res.send(product);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

productsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product: Product = await createProduct(req.body);

        res.status(201);
        res.send(product);
    } catch (err) {
        console.log(err);
        next(new BadRequest());
    }
});

productsRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);
    const {name, price, description, manufacturer} = req.body;
    const productParams: ProductFieldsInterface = {};

    if (name)
        productParams.name = name;
    if(price) {
        productParams.price = parseFloat(price);
    }
    if(description) {
        productParams.description = description;
    }
    if(manufacturer)
        productParams.manufacturer = manufacturer;

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

productsRouter.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);
    const affectedRows = await deleteProductById(id);

    if (affectedRows === 1) {
        res.sendStatus(204);
    } else {
        next(new NotFound());
    }
});

export default productsRouter;