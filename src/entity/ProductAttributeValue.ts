import {Entity, Column, ManyToOne, PrimaryColumn} from "typeorm";
import Product from './Product'
import Attribute from "./Attribute";

@Entity('products_attributes_values')
export default class ProductAttributeValue {

    @PrimaryColumn()
    public productId?: number;

    @PrimaryColumn()
    public attributeId?: number;

    @ManyToOne(type => Product, product => product.productToAttributeValues)
    public product?: Product;

    @ManyToOne(type => Attribute, attribute => attribute.attributeToProductValues)
    public attribute?: Attribute;

    @Column('varchar')
    public value: string;

    public name: string;
}