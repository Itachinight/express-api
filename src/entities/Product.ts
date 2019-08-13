import {Entity, Column, CreateDateColumn, Timestamp, ManyToMany, JoinTable, OneToMany} from "typeorm";
import BaseEntity from './BaseEntity';
import Category from "./Category";
import ProductAttributeValue from "./ProductAttributeValue";
import UserCart from "./UserCart";

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
            name: "productId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "categoryId",
            referencedColumnName: "id"
        }
    })
    categories: Category[];

    @OneToMany(type => ProductAttributeValue,productAttributeValue => productAttributeValue.product)
    productAttributeValues!: ProductAttributeValue[];

    @OneToMany(type => UserCart, userCart => userCart.user)
    cart: UserCart[];

}