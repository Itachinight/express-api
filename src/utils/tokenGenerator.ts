import {sign, SignOptions} from 'jsonwebtoken';

const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '2h'
};

export async function createToken(payload: object): Promise<string> {
    return sign(payload, process.env.JWT_SALT, options);
}