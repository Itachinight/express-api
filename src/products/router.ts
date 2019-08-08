import {Response, Request, Router, NextFunction} from 'express';
import {
    getRepository,
    Repository,
    DeleteResult,
    createQueryBuilder,
    EntityManager,
    getManager
} from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import {NotFound, BadRequest} from 'http-errors';
import Product from '../entity/Product';
import Category from '../entity/Category';
import ProductAttributeValue from '../entity/ProductAttributeValue';

const router: Router = Router();

router.get('/:id/categories', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const products: Category[] = await createQueryBuilder()
        .relation(Product, 'categories')
        .of(id)
        .loadMany();

    res.send(products);
});

router.get('/', async (req: Request, res: Response) => {
    const repository: Repository<Product> = getRepository(Product);

    const products: Product[] = await repository
        .createQueryBuilder('product')
        .getMany();

    res.send(products);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const product: Product = await createQueryBuilder(Product, 'product')
             .leftJoinAndSelect('product.productToAttributeValues', 'values')
             .leftJoinAndSelect('product.categories', 'categories')
             .where('product.id = :id', {id})
             .getOne();

        for (let eav of product.productToAttributeValues) {
            const {name} = await createQueryBuilder()
               .relation(ProductAttributeValue, 'attribute')
               .of(eav)
               .loadOne();
            eav.name = name;
        }

        res.send(product);
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const entityManager: EntityManager = getManager();
    const {categoriesId = [], ...params} = req.body;

    try {
        let product: Product = await entityManager.create(Product);
        await entityManager.transaction(async manager => {
            manager.merge(Product, product, params);

            await manager.insert(Product, product);
            await createQueryBuilder()
                    .relation(Product, 'categories')
                    .of(product)
                    .add(categoriesId);
            });

            // needed for return products info
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

    try {
        let product: Product = await repository.findOneOrFail(id);

        repository.merge(product, req.body);
        product = await repository.save(product);

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

router.delete('/:id', async(req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Product> = getRepository(Product);
    const result: Promise<DeleteResult> = repository.delete(req.params.id);
    const {affected} = await result;

    if (affected === 1) {
        res.send({affected});
    } else {
        next(new NotFound());
    }
});

export default router;