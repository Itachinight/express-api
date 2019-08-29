import {Router} from "express";
import AuthController from "../../../controllers/auth/AuthController";

const authRouter: Router = Router();

authRouter.post('/', AuthController.loginUser);
authRouter.post('/admin', AuthController.loginAdmin);

export default authRouter;