import {Entity, Column, CreateDateColumn, ManyToMany, JoinTable, OneToMany} from "typeorm";
import AbstractEntity from './AbstractEntity';
import Category from "./Category";
import ProductAttribute from "./ProductAttribute";
import UserCart from "./UserCart";

@Entity('products')
export default class Product extends AbstractEntity {

    @Column('text')
    description: string;

    @Column('double')
    price: number;

    @Column()
    manufacturer: string;

    @CreateDateColumn()
    created: Date;

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

    @OneToMany(type => ProductAttribute, productAttribute => productAttribute.product)
    attributes!: ProductAttribute[];

    @OneToMany(type => UserCart, userCart => userCart.user)
    cart: UserCart[];

}