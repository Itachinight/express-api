import {Column, Entity, OneToMany} from "typeorm";
import BaseEntity from "./BaseEntity";
import UserCart from "./UserCart";

type UserRoleType = "admin" | "user"

@Entity('users')
export default class User extends BaseEntity {

    @Column()
    surname: string;

    @Column({unique: true})
    login: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: ["admin", "user"],
        default: "user"
    })
    role: UserRoleType;

    @OneToMany(type => UserCart, userCart => userCart.product)
    cart: UserCart;

}