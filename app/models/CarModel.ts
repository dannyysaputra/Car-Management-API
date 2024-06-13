import BaseModel from "./Model";

export type CarType = {
    id: string;
    plate: string;
    manufacture: string;
    model: string;
    image: string;
    rentPerDay: number;
    capacity: number;
    description: string;
    transmission: string;
    type: string;
    year: number;
    options: string[];
    specs: string[];
    availableAt: Date;
    available: boolean;
    created_by: string;
    updated_by: string;
    deleted_by: string;
    created_at: Date; 
    updated_at: Date; 
}

export class CarModel extends BaseModel {
    static tableName = 'cars';

    id!: string;
    plate!: string;
    manufacture!: string;
    model!: string;
    image!: string;
    rentPerDay!: number;
    capacity!: number;
    description!: string;
    transmission!: string;
    type!: string;
    year!: number;
    options!: string[];
    specs!: string[];
    availableAt!: Date;
    available!: boolean;
    created_by!: string;
    updated_by!: string;
    deleted_by!: string;
    created_at!: Date; 
    updated_at!: Date;
}
