import Content from './Content';
import {Entity, ManyToMany} from "typeorm";
import Product from "./Product";

@Entity('categories')
export default class Category extends Content {

    @ManyToMany(type => Product, product => product.categories)
    products: Promise<Product[]>;
}