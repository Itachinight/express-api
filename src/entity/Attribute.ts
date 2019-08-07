import {Entity, Column} from "typeorm";
import BaseEntity from './BaseEntity';

enum AttributeType {
    varchar = 1,
    int,
}

@Entity('attributes')
export default class Attribute extends BaseEntity{

    @Column({
        type: "enum",
        enum: AttributeType,
        default: AttributeType.varchar
    })
    type: string;

}