import Content from './Content';
import {Entity, OneToMany} from "typeorm";
import Product from "./Product";

@Entity('categories')
export default class Category extends Content {

    @OneToMany(type => Product, product => product.category)
    products: Product[];
}