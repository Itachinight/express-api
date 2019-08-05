import * as express from 'express';
import {Response, Request, Router} from 'express';
import {getRepository, Repository, DeleteResult} from "typeorm";
import Product from '../entity/Product'

const productRouter: Router = express.Router();

productRouter.get('/', async (req: Request, res: Response) => {
    const repository: Repository<Product> = getRepository(Product);
    const products: Product[] = await repository.find();

    const json: string = JSON.stringify(products);

    res.send(json);
});

productRouter.get('/:id', async (req: Request, res: Response) => {
    const repository: Repository<Product> = getRepository(Product);
    const id: number = parseInt(req.params.id, 10);
    const product: Product = await repository.findOne(id);

    res.send(JSON.stringify(product));
});

productRouter.post('/', async (req: Request, res: Response) => {
    const repository: Repository<Product> = getRepository(Product);
    const product: Product[] = await repository.create(req.body);
    const result: Product[] = await repository.save(product);
    res.send(result);
});

productRouter.put('/:id', async (req: Request, res: Response) => {
    const repository: Repository<Product> = getRepository(Product);
    const id: number = parseInt(req.params.id, 10);
    const product: Product = await repository.findOne(id);

    repository.merge(product, req.body);
    const result: Product = await repository.save(product);

    return res.send(result);
});

productRouter.delete('/:id', async(req: Request, res: Response) => {
    const repository: Repository<Product> = getRepository(Product);
    const results: DeleteResult = await repository.delete(req.params.id);

    return res.send(results.affected);
});

export default productRouter;