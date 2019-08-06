import * as express from 'express';
import {Response, Request, Router, NextFunction} from 'express';
import {getRepository, Repository, DeleteResult} from "typeorm";
import {NotFound, BadRequest} from 'http-errors';
import Product from '../entity/Product';

const router: Router = express.Router();

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
    let product: Product[] = await repository.create(req.body);

    try {
        product = await repository.save(product);
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