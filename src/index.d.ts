interface ProductSearchParams {
    name?: string;
    manufacturer?: string,
    maxPrice?: number,
    minPrice?: number,
    categoryId?: number,
    attrId?: number,
    attrValue?: string,
    search?: string,
}

interface ProductFieldsInterface {
    name?: string;
    description?: string,
    price?: number,
    manufacturer?: string,
}

interface AttributeFieldsInterface {
    name?: string;
}

interface CategoryFieldsInterface {
    name?: string;
    description?: string,
}

interface UserFieldsInterface {
    admin?: boolean,
    id?: number,
    name?: string,
    password?: string,
    surname?: string,
    login?: string,
    email?: string,
}
declare namespace Express {
    export interface Request {
        user?: UserFieldsInterface
    }
}