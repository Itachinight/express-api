import {Router} from "express";
import adminRouter from "./adminRouter";
import attributeRouter from "./attrubuteRouter";
import authRouter from "./authRouter";
import categoryRouter from "./categoryRouter";
import productRouter from "./productRouter";
import userRouter from "./userRouter";

const router: Router = Router();

router.use('/admins', adminRouter);
router.use('/attributes', attributeRouter);
router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/users', userRouter);

export default router;