import {BaseEntity, Column, PrimaryGeneratedColumn} from "typeorm";

export default abstract class AbstractEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}