import {DeleteResult, getRepository, InsertResult, Repository, UpdateResult} from "typeorm";
import UserCart from "../entities/UserCart";

export default class CartModel{
    private readonly repository: Repository<UserCart>;

    constructor() {
        this.repository = getRepository(UserCart)
    }

    public async checkoutUserCartById(id: number): Promise<UpdateResult> {
        return this.repository.createQueryBuilder()
            .update()
            .set({payStatus: true})
            .where('userId = :id', {id})
            .execute();
    }

    public async getUserCartById(id: number): Promise<UserCart[]> {
        return this.repository.createQueryBuilder('cart')
            .innerJoin('cart.product', 'product')
            .addSelect(['product.name', 'product.price', 'product.description', 'product.manufacturer'])
            .where('cart.userId = :id AND cart.payStatus = 0',{id})
            .getMany();
    }

    public async getUserCartProductById(userId: number, productId: number): Promise<UserCart> {
        return this.repository.createQueryBuilder('cart')
            .innerJoin('cart.product', 'product')
            .addSelect(['product.name', 'product.price', 'product.description', 'product.manufacturer'])
            .where('cart.userId = :userId AND product.id = :productId AND cart.payStatus = 0',{userId, productId})
            .getOne();
    }

    public async addProductToCartById(userId: number, productId: number, quantity: number): Promise<InsertResult> {
        return this.repository.createQueryBuilder()
            .insert()
            .values({productId, userId, quantity})
            .execute();
    }

    public async updateProductFormCartById(userId: number, productId: number, quantity: number): Promise<UpdateResult> {
        return this.repository.createQueryBuilder()
            .update()
            .set({quantity})
            .where('userId = :userId', {userId})
            .andWhere('productId = :productId', {productId})
            .execute();
    };

    public async deleteProductFormCartById(userId: number, productId: number): Promise<DeleteResult> {
        return this.repository.createQueryBuilder()
            .delete()
            .where('userId = :userId', {userId})
            .andWhere('productId = :productId', {productId})
            .execute();
    };

    public static getUserCartTotal(cart: UserCart[]): number {
        let total = 0;

        for (const item of cart) {
            const {quantity, product} = item;
            total += quantity * product.price;
        }

        return parseFloat(total.toFixed(2));
    }
}