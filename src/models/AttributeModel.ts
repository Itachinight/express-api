import {DeleteResult, getRepository, Repository} from "typeorm";
import Attribute from "../entities/Attribute";

export default class AttributeModel {
    private attributeRepository: Repository<Attribute>;

    constructor() {
        this.attributeRepository = getRepository(Attribute);
    }

    public async getAttributeById(id: number): Promise<Attribute> {
        return this.attributeRepository.findOneOrFail(id);
    }

    public async getAttributes(): Promise<Attribute[]> {
        return this.attributeRepository.find();
    }

    public async createAttribute(params: AttributeFieldsInterface): Promise<Attribute> {
        const attribute: Attribute = this.attributeRepository.create(params);
        return this.attributeRepository.save(attribute);
    }

    public async updateAttributeById(id: number, params: AttributeFieldsInterface): Promise<Attribute> {
        const attribute: Attribute = await this.getAttributeById(id);
        this.attributeRepository.merge(attribute, params);
        return this.attributeRepository.save(attribute);
    }

    public async deleteAttributeById(id: number): Promise<DeleteResult> {
        return this.attributeRepository.delete(id);
    }



}