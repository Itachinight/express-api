import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    BaseEntity,
    Timestamp,
    UpdateDateColumn
} from "typeorm";
import Product from './Product'
import User from "./User";

@Entity('user_carts')
export default class UserCart extends BaseEntity{

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    productId: number;

    @Column()
    quantity: number;

    @Column({default: false})
    payStatus: boolean;

    @UpdateDateColumn()
    updated: Date;

    @ManyToOne(type => User, user => user.cart, {onDelete: "CASCADE"})
    user?: User;

    @ManyToOne(type => Product, product => product.cart,{onDelete: "CASCADE"})
    product?: Product;


}