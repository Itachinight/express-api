import {DeleteResult, getRepository, Repository} from "typeorm";
import Attribute from "../entities/Attribute";

export default class AttributeModel {
    private repository: Repository<Attribute>;

    constructor() {
        this.repository = getRepository(Attribute);
    }

    public async getAttributeById(id: number): Promise<Attribute> {
        return this.repository.findOneOrFail(id);
    }

    public async getAttributes(): Promise<Attribute[]> {
        return this.repository.find();
    }

    public async createAttribute(params: AttributeFieldsInterface): Promise<Attribute> {
        const attribute: Attribute = this.repository.create(params);
        return this.repository.save(attribute);
    }

    public async updateAttributeById(id: number, params: AttributeFieldsInterface): Promise<Attribute> {
        const attribute: Attribute = await this.getAttributeById(id);
        this.repository.merge(attribute, params);
        return this.repository.save(attribute);
    }

    public async deleteAttributeById(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}