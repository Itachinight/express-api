import {Entity, OneToMany} from "typeorm";
import BaseEntity from './BaseEntity';
import ProductAttributeValue from "./ProductAttributeValue";

@Entity('attributes')
export default class Attribute extends BaseEntity{

    @OneToMany(type => ProductAttributeValue, productAttributeValue => productAttributeValue.attribute)
    public attributeToProductValues!: ProductAttributeValue[];

}