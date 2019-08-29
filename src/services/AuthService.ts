import {kdf,verify} from 'scrypt-kdf';
import {sign as signJwt, SignOptions} from "jsonwebtoken";

export default class AuthService {
    static encoding: BufferEncoding = "base64";
    static options: SignOptions = {
        algorithm: 'HS256',
        expiresIn: '2h'
    };

    static async hashPassword(password: string): Promise<string> {
        const buffer: Buffer = await kdf(password, {p: 1, r: 8, logN: 16});
        return buffer.toString(AuthService.encoding);
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        const buffer: Buffer = Buffer.from(hash, AuthService.encoding);
        return verify(buffer, password);
    }

    static async createToken(payload: object): Promise<string> {
        return signJwt(payload, process.env.JWT_SALT, AuthService.options);
    }
}