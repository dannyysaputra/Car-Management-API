import BaseModel  from "./Model";

export type CarType = {
    id: string;
    name: string;
    price: number;
    image: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
    created_at: Date; 
    updated_at: Date; 
}

export class CarModel extends BaseModel {
    static tableName = 'cars';

    id!: string;
    name!: string;
    price!: number;
    image!: string;
    created_by!: string;
    updated_by!: string;
    deleted_by!: string;
}