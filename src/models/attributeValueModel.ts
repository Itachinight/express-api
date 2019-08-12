import {createQueryBuilder, DeleteResult, getRepository} from "typeorm";
import ProductAttributeValue from "../entities/ProductAttributeValue";
import Product from "../entities/Product";
import {InsertResult} from "typeorm";

const assignAttributeNameToValue = (value: ProductAttributeValue): void => {
    const {name} = value.attribute;
    value.name = name;
    delete value.attribute;
};

export const formatProductAttributeValues = (product: Product): void => {
    const {productAttributeValues} = product;

    for (const value of productAttributeValues) {
        assignAttributeNameToValue(value);
    }
};

export const getProductAttributeValueById = async (productId: number, attributeId: number): Promise<ProductAttributeValue> => {
    const value: ProductAttributeValue = await getRepository(ProductAttributeValue)
        .createQueryBuilder('values')
        .where('productId = :productId', {productId})
        .andWhere('attributeId = :attributeId', {attributeId})
        .leftJoinAndSelect('values.attribute', 'attribute')
        .getOne();

    assignAttributeNameToValue(value);

    return value;
};

export const getProductAttributeValues = async (productId: number): Promise<ProductAttributeValue[]> => {
    const values: ProductAttributeValue[] = await getRepository(ProductAttributeValue)
        .createQueryBuilder('values')
        .where('productId = :productId', {productId})
        .leftJoinAndSelect('values.attribute', 'attribute')
        .getMany();

    for (const value of values) {
        assignAttributeNameToValue(value);
    }

    return values;
};

export const addProductAttributeValue = async (
    productId: number,
    attributeId: number,
    value: string
): Promise<InsertResult> => {
    return createQueryBuilder()
        .insert()
        .into(ProductAttributeValue)
        .values({productId, attributeId, value})
        .execute();
};

export const deleteProductAttributeValue = async (productId: number, attributeId: number): Promise<DeleteResult> => {
    return getRepository(ProductAttributeValue)
        .createQueryBuilder('values')
        .delete()
        .where('productId = :productId', {productId})
        .andWhere('attributeID = :attributeId', {attributeId})
        .execute();
};