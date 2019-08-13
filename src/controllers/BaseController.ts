import {Router} from "express";

export default abstract class BaseController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.setRoutes();
    }

    protected abstract setRoutes(): void;
}
