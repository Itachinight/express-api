import {Response, Request, Router, NextFunction} from 'express';
import {getRepository, Repository, DeleteResult, createQueryBuilder} from "typeorm";
import {NotFound, BadRequest} from 'http-errors';
import Category from "../entity/Category";
import Product from "../entity/Product";

const router: Router = Router();

router.get('/:id/products', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const products: Product[] = await createQueryBuilder()
        .relation(Category, "products")
        .of(id)
        .loadMany();

    res.send(products);
});

router.get('/', async (req: Request, res: Response) => {
    const repository: Repository<Category> = getRepository(Category);
    const categories: Category[] = await repository.find();

    res.send(categories);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Category> = getRepository(Category);
    const id: number = parseInt(req.params.id, 10);

    try {
        const category: Category = await repository.findOneOrFail(id);
        res.send(category);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Category> = getRepository(Category);
    const {products, ...params} = req.body;

    let category: Category = repository.create();
    repository.merge(category, params);

    try {
        category = await repository.save(category);

        for await (const productId of products) {
            createQueryBuilder()
                .relation(Category, "products")
                .of(category)
                .add(productId);
        }

        // needed for return products info
        await category.products;

        res.send(category);
    } catch (err) {
        console.log(err);
        next(new BadRequest());
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Category> = getRepository(Category);
    const id: number = parseInt(req.params.id, 10);
    let category: Category;

    try {
        category = await repository.findOneOrFail(id);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }

    repository.merge(category, req.body);

    try {
        category = await repository.save(category);
        res.send(category);
    } catch (err) {
        console.log(err);
        next(new BadRequest());
    }
});

router.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Category> = getRepository(Category);
    const result: DeleteResult = await repository.delete(req.params.id);

    if (result.affected === 1) {
        res.send(result);
    } else {
        next(new NotFound());
    }
});

export default router;