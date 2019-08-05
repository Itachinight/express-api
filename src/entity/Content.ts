import {Column, PrimaryGeneratedColumn} from "typeorm";

export default abstract class Content {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

}