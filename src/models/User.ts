import {BeforeInsert, BeforeUpdate, Column, Entity, OneToMany} from "typeorm";
import AbstractEntity from "./AbstractEntity";
import UserCart from "./UserCart";
import {kdf} from "scrypt-kdf";

@Entity('users')
export default class User extends AbstractEntity {

    @Column()
    surname: string;

    @Column({unique: true})
    login: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @OneToMany(type => UserCart, userCart => userCart.product)
    cart: UserCart;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        const buffer: Buffer = await kdf(this.password, {p: 1, r: 8, logN: 16});
        this.password =  buffer.toString('base64');
    }
}