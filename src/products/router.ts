import {Response, Request, Router, NextFunction} from 'express';
import {getRepository, Repository, DeleteResult, createQueryBuilder} from "typeorm";
import {NotFound, BadRequest} from 'http-errors';
import Product from '../entity/Product';
import Category from "../entity/Category";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const repository: Repository<Product> = getRepository(Product);
    const products: Product[] = await repository.find();

    res.send(products);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Product> = getRepository(Product);
    const id: number = parseInt(req.params.id, 10);

    try {
        const product: Product = await repository.findOneOrFail(id);
        res.send(product);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Product> = getRepository(Product);
    const {categories=[], ...params} = req.body;
    let product: Product = await repository.create();
    product = repository.merge(product, params);

    try {
        product = await repository.save(product);

        for await (const categoryId of categories) {
            createQueryBuilder()
                .relation(Product, "categories")
                .of(product)
                .add(categoryId);
        }

        await product.categories;
        res.send(product);
    } catch (err) {
        console.log(err);
        next(new BadRequest());
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Product> = getRepository(Product);
    const id: number = parseInt(req.params.id, 10);
    let product: Product;

    try {
        product = await repository.findOneOrFail(id);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }

    repository.merge(product, req.body);

    try {
        product = await repository.save(product);
        res.send(product);
    } catch (err) {
        console.log(err);
        next(new BadRequest());
    }
});

router.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Product> = getRepository(Product);
    const result: DeleteResult = await repository.delete(req.params.id);

    if (result.affected === 1) {
        res.send(result);
    } else {
        next(new NotFound());
    }
});

export default router;