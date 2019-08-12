import {Entity, Column, CreateDateColumn, Timestamp, ManyToMany, JoinTable, OneToMany} from "typeorm";
import BaseEntity from './BaseEntity';
import Category from "./Category";
import ProductAttributeValue from "./ProductAttributeValue";

@Entity('products')
export default class Product extends BaseEntity {

    @Column('text')
    description: string;

    @Column('double')
    price: number;

    @Column()
    manufacturer: string;

    @CreateDateColumn()
    created: Timestamp;

    @ManyToMany(type => Category, category => category.products)
    @JoinTable({
        name: 'products_categories',
        joinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })
    categories: Category[];

    @OneToMany(
        type => ProductAttributeValue,
        productAttributeValue => productAttributeValue.product
    )
    productAttributeValues!: ProductAttributeValue[];

}