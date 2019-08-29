import {SelectQueryBuilder} from "typeorm";
import Product from "../models/Product";

interface ProductSearchParams {
    name?: string;
    manufacturer?: string,
    maxPrice?: number,
    minPrice?: number,
    categoryId?: number,
    attrId?: number,
    attrValue?: string,
    page?: number,
    limit?: number,
    search?: string,
}

export default class ProductService {
    public static addSearchParams(qb: SelectQueryBuilder<Product>, queryParams: ProductSearchParams): void {
        const {
            name,
            page = 1,
            search,
            attrId,
            maxPrice,
            minPrice,
            attrValue,
            limit = 5,
            categoryId,
            manufacturer,
        } = queryParams;

        qb.take(limit);
        qb.skip((page - 1) * limit);

        if (name) qb.andWhere("product.name LIKE :name", {name: `%${name}%`});

        if (manufacturer) {
            qb.andWhere("product.manufacturer LIKE :manufacturer", {manufacturer: `%${manufacturer}%`});
        }

        if (categoryId) qb.andWhere('categories.id = :categoryId', {categoryId});

        if (attrId) qb.andWhere('attributes.attributeId = :attrId', {attrId});

        if (attrValue) qb.andWhere('attributes.value LIKE :attrValue', {attrValue: `%${attrValue}%`});

        if (search) {
            qb.andWhere(
                `attributes.value LIKE :search OR product.name LIKE :search OR product.manufacturer LIKE :search
                OR categories.name LIKE :search OR product.description LIKE :search`,
                {search: `%${search}%`}
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
}