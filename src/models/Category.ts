import AbstractEntity from './AbstractEntity';
import {Column, Entity, ManyToMany} from "typeorm";
import Product from "./Product";

@Entity('categories')
export default class Category extends AbstractEntity {

    @Column('text')
    description: string;

    @ManyToMany(type => Product, product => product.categories)
    products: Product[];
}