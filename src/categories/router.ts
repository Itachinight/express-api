import * as express from 'express';
import {Response, Request, Router, NextFunction} from 'express';
import {getRepository, Repository, DeleteResult} from "typeorm";
import {NotFound, BadRequest} from 'http-errors';
import Category from "../entity/Category";

const router: Router = express.Router();

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
        res.send(JSON.stringify(category));
    } catch (err) {
        console.log(err);
        next(new NotFound());
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const repository: Repository<Category> = getRepository(Category);
    let category: Category[] = await repository.create(req.body);

    try {
        category = await repository.save(category);
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