import BaseEntity from './BaseEntity';
import {Column, Entity, ManyToMany} from "typeorm";
import Product from "./Product";

@Entity('categories')
export default class Category extends BaseEntity {

    @Column('text')
    description: string;

    @ManyToMany(type => Product, product => product.categories)
    products: Promise<Product[]>;
}