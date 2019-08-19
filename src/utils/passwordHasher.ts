import {kdf,verify} from 'scrypt-kdf';

const encoding = 'base64';

export async function hashPassword(password: string): Promise<string> {
    const buffer: Buffer = await kdf(password, {p: 1, r: 8, logN: 16});
    return buffer.toString(encoding);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const buffer: Buffer = Buffer.from(hash, encoding);
    return verify(buffer, password);
}