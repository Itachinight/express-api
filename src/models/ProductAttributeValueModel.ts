import {DeleteResult, getRepository, Repository, UpdateResult} from "typeorm";
import ProductAttributeValue from "../entities/ProductAttributeValue";
import Product from "../entities/Product";
import {InsertResult} from "typeorm";

export default class ProductAttributeValueModel {
    private readonly repository: Repository<ProductAttributeValue>;

    constructor() {
        this.repository = getRepository(ProductAttributeValue);
    }

    public static assignAttributeNameToValue(value: ProductAttributeValue): void {
        const {name} = value.attribute;
        value.name = name;
        delete value.attribute;
    };

    public static formatProductAttributeValues(product: Product): void {
        const {productAttributeValues} = product;

        for (const value of productAttributeValues) {
            ProductAttributeValueModel.assignAttributeNameToValue(value);
        }
    };

    public async getProductAttributeValueById(productId: number, attributeId: number): Promise<ProductAttributeValue> {
        const value: ProductAttributeValue = await this.repository.createQueryBuilder('values')
            .where('productId = :productId', {productId})
            .andWhere('attributeId = :attributeId', {attributeId})
            .leftJoinAndSelect('values.attribute', 'attribute')
            .getOne();

        ProductAttributeValueModel.assignAttributeNameToValue(value);

        return value;
    };

    public async getProductAttributeValues(productId: number): Promise<ProductAttributeValue[]> {
        const values: ProductAttributeValue[] = await this.repository.createQueryBuilder('values')
            .where('productId = :productId', {productId})
            .leftJoinAndSelect('values.attribute', 'attribute')
            .getMany();

        for (const value of values) {
            ProductAttributeValueModel.assignAttributeNameToValue(value);
        }

        return values;
    };

    public async addProductAttributeValue(productId: number, attributeId: number, value: string): Promise<InsertResult> {
        return this.repository.createQueryBuilder()
            .insert()
            .values({productId, attributeId, value})
            .execute();
    };

    public async updateProductAttributeValueById(productId: number, attributeId: number, value: string): Promise<UpdateResult> {
        return this.repository.createQueryBuilder()
            .update()
            .set({value})
            .where('productId = :productId', {productId})
            .andWhere('attributeId = :attributeId', {attributeId})
            .execute();
    };

    public async deleteProductAttributeValue(productId: number, attributeId: number): Promise<DeleteResult> {
        return this.repository.createQueryBuilder('values')
            .delete()
            .where('productId = :productId', {productId})
            .andWhere('attributeId = :attributeId', {attributeId})
            .execute();
    };
}