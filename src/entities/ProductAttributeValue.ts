import {Entity, Column, ManyToOne, PrimaryColumn} from "typeorm";
import Product from './Product'
import Attribute from "./Attribute";

@Entity('products_attributes_values')
export default class ProductAttributeValue {

    @PrimaryColumn()
    productId: number;

    @PrimaryColumn()
    attributeId: number;

    @ManyToOne(type => Product, product => product.productAttributeValues, {onDelete: "CASCADE"})
    product?: Product;

    @ManyToOne(type => Attribute, attribute => attribute.attributeToProductValues,{eager: true, onDelete: "CASCADE"})
    attribute?: Attribute;

    @Column('varchar')
    value: string;

    name: string;
}