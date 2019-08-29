import ProductAttribute from "../models/ProductAttribute";
import Product from "../models/Product";

export default class ProductAttributeService {

    public static assignAttributeNameToValue(value: ProductAttribute): void {
        const {name} = value.attribute;
        value.name = name;
        delete value.attribute;
    }

    public static formatProductAttributeValues(product: Product): void {
        const {attributes} = product;

        for (const value of attributes) {
            ProductAttributeService.assignAttributeNameToValue(value);
        }
    }

    public static async getProductAttributeValue(productId: number, attributeId: number): Promise<ProductAttribute> {
        return ProductAttribute.createQueryBuilder('values')
            .where('productId = :productId', {productId})
            .andWhere('attributeId = :attributeId', {attributeId})
            .leftJoinAndSelect('values.attribute', 'attribute')
            .getOne();
    }
}