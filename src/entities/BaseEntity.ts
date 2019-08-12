import {Column, PrimaryGeneratedColumn} from "typeorm";

export default abstract class BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}