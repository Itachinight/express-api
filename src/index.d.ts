interface ProductSearchParams {
    name?: string;
    manufacturer?: string,
    maxPrice?: number,
    minPrice?: number,
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