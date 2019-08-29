interface UserAuthInterface {
    admin?: boolean,
    id: number,
    name: string,
    surname: string,
    login: string,
    email: string,
}

declare namespace Express {
    export interface Request {
        user?: UserAuthInterface
    }
}