import {Response, Request, NextFunction} from 'express';
import {EntityNotFoundError} from 'typeorm/error/EntityNotFoundError'
import {NotFound, BadRequest} from 'http-errors';
import Product from '../../models/Product';
import {SelectQueryBuilder} from "typeorm";
import Category from "../../models/Category";
import ProductAttributeService from "../../services/ProductAttributeService";
import ProductService from "../../services/ProductService";

export default class ProductController {

    static async getItem(req: Request, res: Response, next: NextFunction) {
        const {productId} = req.params;

        try {
            const product: Product = await Product.findOneOrFail({
                relations: ["categories", "attributes", "attributes.attribute"],
                where: {
                    id: productId
                }
            });

            ProductAttributeService.formatProductAttributeValues(product);

            res.send(product);
        } catch (err) {
            console.log(err);
            next(new NotFound());
        }
    }

    static async getList(req: Request, res: Response) {
        const qb: SelectQueryBuilder<Product> = Product.createQueryBuilder('product')
            .leftJoin('product.categories', 'categories')
            .leftJoin('product.attributes', 'attributes');
            //.leftJoin('attributes.attribute' , 'attribute');

        ProductService.addSearchParams(qb, req.query);

        res.send(await qb.getMany());
    }

    static async createItem(req: Request, res: Response, next: NextFunction) {
        const {name, description, price, manufacturer, categories: categoryIds} = req.body;

        try {
            const product: Product = await Product.create({name, description, price, manufacturer});
            const categories: Category[] = [];

            for (const categoryId of categoryIds) {
                categories.push(await Category.findOneOrFail(categoryId))
            }

            product.categories = categories;

            res.send(await Product.save(product));
        } catch (err) {
            console.log(err);
            next(new BadRequest());
        }
    }

    static async updateItem(req: Request, res: Response, next: NextFunction) {
        const {productId} = req.params;
        const {name, description, price, manufacturer} = req.body;

        try {
            const product: Product = await Product.findOneOrFail(productId);
            Product.merge(product, {name, description, price, manufacturer});

            res.send(await Product.save(product));
        } catch (err) {
            console.log(err);
            if (err instanceof EntityNotFoundError) {
                next(new NotFound());
            } else next(new BadRequest());
        }
    }

    static async deleteItem(req: Request, res: Response, next: NextFunction) {
        const {productId} = req.params;
        const {affected} = await Product.delete(productId);

        if (affected === 0) {
            next(new NotFound());
        } else res.sendStatus(204);
    }
}