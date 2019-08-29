import {BeforeInsert, BeforeUpdate, Column, Entity} from "typeorm";
import AbstractEntity from "./AbstractEntity";
import {kdf} from "scrypt-kdf";

@Entity('admins')
export default class User extends AbstractEntity {

    @Column()
    surname: string;

    @Column({unique: true})
    login: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        const buffer: Buffer = await kdf(this.password, {p: 1, r: 8, logN: 16});
        this.password =  buffer.toString('base64');
    }

    admin: boolean = true;

}