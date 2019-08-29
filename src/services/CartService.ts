import UserCart from "../models/UserCart";

export default class CartService {

    public static async getUserCart(userId: number):Promise<UserCart[]> {
        return UserCart.find({
            select: ["quantity", "payStatus", "updated" , "product"],
            relations: ['product'],
            where: {userId, payStatus: 0}
        });
    }

    public static getUserCartProduct(userId: number, productId: number): Promise<UserCart> {
        return UserCart.findOneOrFail({
            relations: ['product'],
            where: {
                userId,
                payStatus: 0,
                product: {
                    id: productId
                }
            }
        })
    }

    public static getUserCartTotal(cart: UserCart[]): number {
        let total = 0;

        for (const item of cart) {
            const {quantity, product} = item;
            total += quantity * product.price;
        }

        return parseFloat(total.toFixed(2));
    }
}