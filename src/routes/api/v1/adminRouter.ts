import {Router} from "express";
import AdminController from "../../../controllers/admin/AdminController";
import {allowForAdmin, parseReqToken} from "../../../middlewares/authMiddleware";

const adminRouter: Router = Router();

adminRouter.use(parseReqToken, allowForAdmin);
adminRouter.post('/', AdminController.createAdmin);
adminRouter.post('/checkout/:userId', AdminController.checkoutUserCart);

export default adminRouter;