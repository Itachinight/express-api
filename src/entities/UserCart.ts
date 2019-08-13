import {Entity, Column, ManyToOne, PrimaryColumn} from "typeorm";
import Product from './Product'
import User from "./User";

@Entity('user_carts')
export default class UserCart {

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    productId: number;

    @ManyToOne(type => User, user => user.cart, {onDelete: "CASCADE"})
    user?: User;

    @ManyToOne(type => Product, product => product.cart,{eager: true, onDelete: "CASCADE"})
    product?: Product;

    @Column()
    quantity: number;

    @Column({default: false})
    payStatus: boolean;
}