import {Router} from "express";
import CategoryController from "../../../controllers/category/CategoryController";
import {parseReqToken, allowForAdmin} from "../../../middlewares/authMiddleware";

const categoryRouter: Router = Router();

categoryRouter.use(parseReqToken);

categoryRouter.route('/')
    .get(CategoryController.getList)
    .post(allowForAdmin, CategoryController.createItem);

categoryRouter.route('/:categoryId')
    .get(CategoryController.getItem)
    .put(allowForAdmin, CategoryController.updateItem)
    .delete(allowForAdmin, CategoryController.deleteItem);

categoryRouter.get('/:categoryId/products', CategoryController.getProductsByCategoryId);

export default categoryRouter;