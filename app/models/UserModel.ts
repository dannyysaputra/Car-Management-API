import BaseModel from "./Model";

export type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: string;
    created_by: string;
    updated_by: string;
    created_at: Date;
    updated_at: Date;
}

export class UserModel extends BaseModel {
    static tableName = 'users';

    id!: string;
    name!: string;
    email!: string;
    password!: string;
    avatar!: string;
    role!: string;
    created_by!: string;
    updated_by!: string;
}

// export type User = ModelObject<UserModel>;