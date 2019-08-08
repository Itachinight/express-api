import {Response, Request, NextFunction, Router} from 'express';
import {
    Repository,
    DeleteResult,
    EntityManager,
    getRepository,
    createQueryBuilder,
    getManager,
} from "typeorm";
import {NotFound, BadRequest} from 'http-errors';
import Category from "../entity/Category";
import Product from "../entity/Product";
import {EntityNotFoundError} from "typeorm/error/EntityNotFoundError";

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
    const entityManager: EntityManager = getManager();
    const {products, ...params} = req.body;

    try {
        let category: Category = entityManager.create(Category);
        await entityManager.transaction(async manager => {
            manager.merge(Category, category, params);

            await manager.insert(Category, category);
            await manager.createQueryBuilder()
                .relation(Category, "products")
                .of(category)
                .add(products);

        });
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


    try {
        let category: Category = await repository.findOneOrFail(id);
        repository.merge(category, req.body);
        category = await repository.save(category);
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