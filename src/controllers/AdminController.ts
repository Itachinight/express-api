import BaseController from "./BaseController";
import AdminModel from "../models/AdminModel";
import {NextFunction, Request, Response} from "express";
import {BadRequest} from "http-errors";
import Admin from "../entities/Admin";
import {allowForAdmin} from "../utils/helper";
import CartModel from "../models/CartModel";

export default class AdminController extends BaseController {
    private readonly adminModel: AdminModel;
    private readonly cartModel: CartModel;

    constructor() {
        super();
        this.adminModel = new AdminModel();
        this.cartModel = new CartModel();
    }

    protected setRoutes(): void {
        this.router.use(allowForAdmin);

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const admin: Admin = await this.adminModel.createAdmin(req.body);
                res.send(admin);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });

        this.router.post('/checkout', async (req: Request, res: Response, next: NextFunction) => {
            const {userId} = req.body;

            try {
                const {raw} = await this.cartModel.checkoutUserCartById(userId);
                res.send(raw);
            } catch (err) {
                console.log(err);
                next(new BadRequest());
            }
        });
    }
}