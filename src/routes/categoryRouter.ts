import {Router} from "express";
import CategoryController from "../controllers/CategoryController";

const categoryRouter: Router = Router();

categoryRouter.route('/')
    .get(CategoryController.getList)
    .post(CategoryController.createItem);

categoryRouter.route('/:id')
    .get(CategoryController.getItem)
    .put(CategoryController.updateItem)
    .delete(CategoryController.deleteItem);

categoryRouter.get('/:id/products', CategoryController.getProductsByCategoryId);

export default categoryRouter;