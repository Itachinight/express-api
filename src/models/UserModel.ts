import {getRepository, Repository} from "typeorm";
import User from "../entities/User";
import {hashPassword} from "../utils/passwordHasher";

export default class UserModel {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    public async createUser(params: UserFieldsInterface): Promise<User> {
        params.password = await hashPassword(params.password);
        const user: User = this.repository.create(params);

        return this.repository.save(user);
    }

    public async getUserByLogin(login: string): Promise<User> {
        return this.repository.findOneOrFail({login});
    }
}