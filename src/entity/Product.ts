import {Entity, Column, CreateDateColumn, Timestamp, ManyToOne} from "typeorm";
import Content from './Content';
import Category from "./Category";

@Entity('products')
export default class Product extends Content{

    @Column('double')
    price: number;

    @Column()
    manufacturer: string;

    @CreateDateColumn()
    created: Timestamp;

    @ManyToOne(type => Category, category => category.products)
    category: Category;
}