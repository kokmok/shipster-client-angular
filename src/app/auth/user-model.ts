export interface IUser {
    id?: number;
    email?: string;
    roles?: string[];
}

export class User implements IUser {

    constructor(public id?: number, public email?: string, public roles?: string[]) {
    }
}
