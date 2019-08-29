import {Router} from "express";
import {parseReqToken, validateUserRequest} from "../../../middlewares/authMiddleware";
import UserController from "../../../controllers/user/UserController";
import UserCartController from "../../../controllers/user/cart/UserCartController";

const userRouter: Router = Router();

userRouter.route('/')
    .post(UserController.createUser);

userRouter.route('/:userId/cart')
    .all(parseReqToken, validateUserRequest)
    .get(UserCartController.getUserCart)
    .post(UserCartController.addProductToCart);

userRouter.route('/:userId/cart/:productId')
    .all(parseReqToken, validateUserRequest)
    .get(UserCartController.getCartProductById)
    .put(UserCartController.updateCartProductById)
    .delete(UserCartController.deleteCartProductById);

export default userRouter;