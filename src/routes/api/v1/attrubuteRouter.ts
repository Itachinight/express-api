import {Router} from "express";
import AttributeController from "../../../controllers/attribute/AttributeController";
import {allowForAdmin, parseReqToken} from "../../../middlewares/authMiddleware";

const attributeRouter: Router = Router();

attributeRouter.use(parseReqToken);

attributeRouter.route('/')
    .get(AttributeController.getList)
    .post(allowForAdmin, AttributeController.createItem);

attributeRouter.route('/:attributeId')
    .get(AttributeController.getItem)
    .put(allowForAdmin, AttributeController.updateItem)
    .delete(allowForAdmin, AttributeController.deleteItem);

export default attributeRouter;