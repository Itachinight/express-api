import {Router} from "express";
import ProductController from "../../../controllers/product/ProductController";
import ProductCategoriesController from "../../../controllers/product/categories/ProductCategoriesController";
import ProductAttributesController from "../../../controllers/product/attributes/ProductAttributesController";
import {parseReqToken, allowForAdmin} from "../../../middlewares/authMiddleware";

const productRouter: Router = Router();

productRouter.use(parseReqToken);

productRouter.route('/')
    .get(ProductController.getList)
    .post(allowForAdmin, ProductController.createItem);

productRouter.route('/:productId')
    .get(ProductController.getItem)
    .put(allowForAdmin, ProductController.updateItem)
    .delete(allowForAdmin, ProductController.deleteItem);

productRouter.route('/:productId/categories')
    .get(ProductCategoriesController.getList)
    .post(allowForAdmin, ProductCategoriesController.createItem);

productRouter.delete('/:productId/categories/:categoryId', allowForAdmin, ProductCategoriesController.deleteItem);

productRouter.route('/:productId/attributes')
    .get(ProductAttributesController.getList)
    .post(allowForAdmin, ProductAttributesController.createItem);

productRouter.route('/:productId/attributes/:attributeId')
    .get(ProductAttributesController.getItem)
    .put(allowForAdmin, ProductAttributesController.updateItem)
    .delete(allowForAdmin, ProductAttributesController.deleteItem);

export default productRouter;