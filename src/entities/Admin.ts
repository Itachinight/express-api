import {Column, Entity} from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity('admins')
export default class User extends BaseEntity {

    @Column()
    surname: string;

    @Column({unique: true})
    login: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    admin: boolean = true;

}