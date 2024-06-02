import { CarModel, CarType } from '../models/CarModel';
import { CarHistoryModel } from '../models/CarHistoryModel';
import { Transaction } from 'objection';

export class CarRepository {
  public async getCars(): Promise<CarType[]> {
    return await CarModel.query();
  }

  public async createCar(data: Partial<CarType>): Promise<CarType> {
    return await CarModel.query().insert(data);
  }

  public async findCarById(id: string): Promise<CarType | undefined> {
    return await CarModel.query().findById(id);
  }

  public async updateCar(id: string, data: Partial<CarType>): Promise<CarType | undefined> {
    return await CarModel.query().patchAndFetchById(id, data);
  }

  public async deleteCarById(id: string, trx?: Transaction): Promise<number> {
    return await CarModel.query(trx).deleteById(id);
  }

  public async createCarHistory(data: { car_id: string; user_id: string; action: string }, trx?: Transaction): Promise<void> {
    await CarHistoryModel.query(trx).insert(data);
  }

  public async getCarHistories(): Promise<CarHistoryModel[]> {
    return await CarHistoryModel.query();
  }

  public async startTransaction(): Promise<Transaction> {
    return await CarModel.startTransaction();
  }
}
