import Product from "../entities/Product";
import {createQueryBuilder} from "typeorm";
import Category from "../entities/Category";

export default class ProductCategoryService {
    public static async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
        return createQueryBuilder()
            .relation(Category, "products")
            .of(categoryId)
            .loadMany();
    };
}