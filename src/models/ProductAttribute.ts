import {Entity, Column, ManyToOne, PrimaryColumn, BaseEntity} from "typeorm";
import Product from './Product'
import Attribute from "./Attribute";

@Entity('products_attributes_values')
export default class ProductAttribute extends BaseEntity {

    @PrimaryColumn()
    productId: number;

    @PrimaryColumn()
    attributeId: number;

    @ManyToOne(type => Product, product => product.attributes, {onDelete: "CASCADE"})
    product?: Product;

    @ManyToOne(type => Attribute, attribute => attribute.products,{onDelete: "CASCADE"})
    attribute?: Attribute;

    @Column('varchar')
    value: string;

    name: string;
}