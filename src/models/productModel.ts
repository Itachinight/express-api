import {createQueryBuilder, DeleteResult, getRepository, Repository, SelectQueryBuilder} from "typeorm";
import Product from "../entities/Product";
import Category from "../entities/Category";
import {formatProductAttributeValues} from "./attributeValueModel";

export const checkProductPresence = async (productId: number): Promise<void> => {
    const repository: Repository<Product> = getRepository(Product);
    await repository.findOneOrFail(productId);
};

export const getProducts = async (queryParams: ProductSearchParams): Promise<Product[]> => {
    const {name, manufacturer, maxPrice, minPrice} = queryParams;
    const repository: Repository<Product> = getRepository(Product);
    const qb: SelectQueryBuilder<Product> = repository.createQueryBuilder('product')
        .leftJoin('product.categories', 'categories')
        .addSelect(['categories.id', 'categories.name'])
        .leftJoin('product.productAttributeValues', 'eav')
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
        formatProductAttributeValues(product);
    }

    return products;
};

export const getProductById = async (id: number): Promise<Product> => {
    const product: Product = await createQueryBuilder(Product, 'product')
        .leftJoinAndSelect('product.categories', 'categories')
        .leftJoin('product.productAttributeValues', 'eav')
        .addSelect(['eav.attributeId','eav.value'])
        .leftJoin('eav.attribute' , 'attr')
        .addSelect('attr.name')
        .where('product.id = :id', {id})
        .getOne();

    formatProductAttributeValues(product);

    return product;
};

export const getProductsByCategoryId = async (categoryId: number): Promise<Product[]> => {
    const repository: Repository<Category> = getRepository(Category);
    const category: Category = await repository.findOneOrFail(categoryId);

    return createQueryBuilder()
        .relation(Category, "products")
        .of(category)
        .loadMany();
};

export const createProduct = async (params: ProductFieldsInterface): Promise<Product> => {
    const repository: Repository<Product> = getRepository(Product);

    const product: Product = repository.create(params);
    return repository.save(product);
};

export const updateProductById = async (id: number, params: ProductFieldsInterface): Promise<Product> => {
    const repository: Repository<Product> = getRepository(Product);
    const product: Product = await repository.findOneOrFail(id);

    repository.merge(product, params);
    return repository.save(product);
};

export const deleteProductById = async (id: number): Promise<number> => {
    const repository: Repository<Product> = getRepository(Product);
    const result: Promise<DeleteResult> = repository.delete(id);
    const {affected} = await result;

    return affected;
};