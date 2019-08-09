import {createQueryBuilder, DeleteResult, getRepository, Repository, SelectQueryBuilder} from "typeorm";
import Product from "../entity/Product";

const getProductAttributeValues = (product: Product) => {
    const {productToAttributeValues} = product;

    for (const value of productToAttributeValues) {
        const {name} = value.attribute;
        value.name = name;
        delete value.attribute;
    }

    return productToAttributeValues;
};

export const getProducts = async (queryParams: ProductSearchParams) => {
    const {name, manufacturer, maxPrice, minPrice} = queryParams;
    const repository: Repository<Product> = getRepository(Product);
    const qb: SelectQueryBuilder<Product> = repository.createQueryBuilder('product')
        .leftJoin('product.categories', 'categories')
        .addSelect(['categories.id', 'categories.name'])
        .leftJoin('product.productToAttributeValues', 'eav')
        .addSelect(['eav.attributeId','eav.value'])
        .leftJoin('eav.attribute' , 'attr')
        .addSelect('attr.name');

    if (name) {
        qb.where("product.name LIKE :name", { name: `%${name}%` })
    }

    if (manufacturer) {
        qb.andWhere("product.manufacturer LIKE :manufacturer", { manufacturer: `%${manufacturer}%` })
    }

    if (maxPrice && minPrice) {
        qb.andWhere("product.price BETWEEN :minPrice AND :maxPrice", { minPrice, maxPrice })
    } else if(maxPrice) {
        qb.andWhere("product.price < :maxPrice", { maxPrice })
    } else if(minPrice) {
        qb.andWhere("product.price > :minPrice", { minPrice })
    }

    const products: Product[] = await qb.getMany();

    for (const product of products) {
        product.productToAttributeValues = getProductAttributeValues(product);
    }

    return products;
};

export const getProductById = async (id: number) => {
    const product: Product = await createQueryBuilder(Product, 'product')
        .leftJoin('product.categories', 'categories')
        .addSelect(['categories.id', 'categories.name'])
        .leftJoin('product.productToAttributeValues', 'eav')
        .addSelect(['eav.attributeId','eav.value'])
        .leftJoin('eav.attribute' , 'attr')
        .addSelect('attr.name')
        .where('product.id = :id', {id})
        .getOne();

    product.productToAttributeValues = getProductAttributeValues(product);

    return product;
};

export const createProduct = async (params: ProductFieldsInterface) => {
    const repository: Repository<Product> = getRepository(Product);

    const product: Product = repository.create(params);
    return await repository.save(product);
};

export const updateProductById = async (id: number, params: ProductFieldsInterface) => {
    const repository: Repository<Product> = getRepository(Product);
    const product: Product = await repository.findOneOrFail(id);

    repository.merge(product, params);
    return await repository.save(product);
};

export const deleteProductById = async (id: number) => {
    const repository: Repository<Product> = getRepository(Product);
    const result: Promise<DeleteResult> = repository.delete(id);
    const {affected} = await result;

    return affected;
};