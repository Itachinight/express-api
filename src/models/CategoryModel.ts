import Category from "../entities/Category";
import {createQueryBuilder, DeleteResult, getRepository, Repository} from "typeorm";
import Product from "../entities/Product";

export default class CategoryModel {
    private repository: Repository<Category>;

    constructor() {
        this.repository = getRepository(Category);
    }

    public async getCategoryById(id: number): Promise<Category> {
        return this.repository.findOneOrFail(id);
    };

    public async getCategories(): Promise<Category[]> {
        return this.repository.find();
    };

    public async createCategory(params: CategoryFieldsInterface): Promise<Category> {
        const category: Category = this.repository.create(params);

        return this.repository.save(category);
    };

    public async updateCategoryById(id: number, params: CategoryFieldsInterface): Promise<Category> {
        const category: Category = await this.getCategoryById(id);
        this.repository.merge(category, params);

        return this.repository.save(category);
    };

    public async deleteCategoryById(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    };

    public static async getCategoriesByProductId(productId: number): Promise<Category[]> {
        return createQueryBuilder(Product)
            .relation('categories')
            .of(productId)
            .loadMany();
    };

    public static async addCategoriesToProduct(productId: number, categoriesId: number[]): Promise<void> {
        return createQueryBuilder(Product)
            .relation('categories')
            .of(productId)
            .add(categoriesId);
    };

    public static async deleteCategoriesFromProduct(productId: number, categoriesId: number[]): Promise<void> {
        return createQueryBuilder(Product)
            .relation('categories')
            .of(productId)
            .remove(categoriesId);
    };
}