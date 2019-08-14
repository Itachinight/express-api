import {Column, Entity, OneToMany} from "typeorm";
import BaseEntity from "./BaseEntity";
import UserCart from "./UserCart";

@Entity('users')
export default class User extends BaseEntity {

    @Column()
    surname: string;

    @Column({unique: true})
    login: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string;

    @OneToMany(type => UserCart, userCart => userCart.product)
    cart: UserCart;

}