import BaseModel  from "./Model";

export type CarType = {
    id: string;
    car_id: string;
    user_id: string;
    action: string;
    timestamp: string;
}

export class CarHistoryModel extends BaseModel {
    static tableName = 'car_histories';

    id!: string;
    car_id!: string;
    user_id!: string;
    action!: string;
    timestamp!: string;
}