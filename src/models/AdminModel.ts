import {getRepository, Repository} from "typeorm";
import Admin from "../entities/Admin";
import {hashPassword} from "../utils/passwordHasher";

export default class AdminModel {
    private repository: Repository<Admin>;

    constructor() {
        this.repository = getRepository(Admin);
    }

    public async createAdmin(params: UserFieldsInterface): Promise<Admin> {
        params.password = await hashPassword(params.password);
        const admin: Admin = this.repository.create(params);

        return this.repository.save(admin);
    }

    public async getAdminByLogin(login: string): Promise<Admin> {
        return this.repository.findOneOrFail({login});
    }
}