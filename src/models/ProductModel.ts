import {createQueryBuilder, DeleteResult, getRepository, Repository, SelectQueryBuilder} from "typeorm";
import Product from "../entities/Product";
import Category from "../entities/Category";
import ProductAttributeValueModel from "./ProductAttributeValueModel";

export default class ProductModel {
    private readonly repository: Repository<Product>;

    constructor() {
        this.repository = getRepository(Product);
    }

    public async checkProductPresence(id: number): Promise<void> {
        await this.repository.findOneOrFail(id);
    };

    private static addSearchParams(qb: SelectQueryBuilder<Product>, queryParams: ProductSearchParams): void {
        const {name, manufacturer, maxPrice, minPrice, categoryId, attrId, attrValue, search} = queryParams;

        if (name) qb.andWhere("product.name LIKE :name", {name: `%${name}%`});

        if (manufacturer) {
            qb.andWhere("product.manufacturer LIKE :manufacturer", {manufacturer: `%${manufacturer}%`});
        }

        if (categoryId) qb.andWhere('categories.id = :categoryId', {categoryId});

        if (attrId) qb.andWhere('eav.attributeId = :attrId', {attrId});

        if (attrValue) qb.andWhere('eav.value LIKE :attrValue', {attrValue: `%${attrValue}%`});

        if (search) {
            qb.andWhere(
                `eav.value LIKE :search OR product.name LIKE :search OR product.manufacturer LIKE :search OR
                categories.name LIKE :search OR product.description LIKE :search`
                , {search: `%${search}%`}
            )
        }

        if (maxPrice && minPrice) {
            qb.andWhere("product.price BETWEEN :minPrice AND :maxPrice", {minPrice, maxPrice});
        } else if (maxPrice) {
            qb.andWhere("product.price < :maxPrice", {maxPrice});
        } else if (minPrice) {
            qb.andWhere("product.price > :minPrice", {minPrice});
        }
    }

    public async getProducts(queryParams: ProductSearchParams): Promise<Product[]> {
        const qb: SelectQueryBuilder<Product> = this.repository.createQueryBuilder('product')
            .leftJoin('product.categories', 'categories')
            .leftJoin('product.productAttributeValues', 'eav')
            .leftJoin('eav.attribute' , 'attr');

        ProductModel.addSearchParams(qb, queryParams);

        return qb.getMany();
    };

    public async getProductById(id: number): Promise<Product> {
        const product = await this.repository.findOneOrFail({
            relations: ['productAttributeValues', 'categories', 'productAttributeValues.attribute'],
            where: {id}
        });

        ProductAttributeValueModel.formatProductAttributeValues(product);

        return product;
    };

    public static async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
        return createQueryBuilder()
            .relation(Category, "products")
            .of(categoryId)
            .loadMany();
    };

    public async createProduct(params: ProductFieldsInterface): Promise<Product> {
        const product: Product = this.repository.create(params);
        return this.repository.save(product);
    };

    public async updateProductById(id: number, params: ProductFieldsInterface): Promise<Product> {
        const product: Product = await this.repository.findOneOrFail(id);

        this.repository.merge(product, params);
        return this.repository.save(product);
    };

    public async deleteProductById(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    };
}