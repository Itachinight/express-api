interface ProductSearchParams {
    name?: string;
    manufacturer?: string,
    maxPrice?: number,
    minPrice?: number,
    categoryId?: number,
    attrId?: number,
    attrValue?: string,
}

interface ProductFieldsInterface {
    name?: string;
    description?: string,
    price?: number,
    manufacturer?: string,
}

interface AttributeFieldsInterface {
    name: string;
}

interface CategoryFieldsInterface {
    name?: string;
    description?: string,
}

type UserRoleType = "admin" | "user";

interface UserFieldsInterface {
    name?: string;
    surname?: string;
    login?: string;
    password?: string;
    role?: UserRoleType;
}
declare namespace Express {
    export interface Request {
        user?: UserFieldsInterface
    }
}