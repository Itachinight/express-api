import {Entity, OneToMany} from "typeorm";
import AbstractEntity from './AbstractEntity';
import ProductAttribute from "./ProductAttribute";

@Entity('attributes')
export default class Attribute extends AbstractEntity {

    @OneToMany(type => ProductAttribute, productAttribute => productAttribute.attribute)
    products!: ProductAttribute[];

}