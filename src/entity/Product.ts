import {Entity, Column, CreateDateColumn, Timestamp} from "typeorm";
import Content from './Content';

@Entity('products')
export default class Product extends Content{

    @Column('double')
    price: number;

    @Column()
    manufacturer: string;

    @CreateDateColumn()
    created: Timestamp;

}