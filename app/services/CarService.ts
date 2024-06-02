import { CarType } from '../models/CarModel';
import { CarRepository } from '../repositories/CarRepository';
import { CarHistoryModel } from '../models/CarHistoryModel';

export class CarService {
  private carRepository: CarRepository;

  constructor() {
    this.carRepository = new CarRepository();
  }

  public async getCars(): Promise<CarType[]> {
    return this.carRepository.getCars();
  }

  public async createCar(data: Partial<CarType>, image: string, userId: string): Promise<CarType> {
    const carData = { ...data, image, created_by: userId, updated_by: userId };
    const newCar = await this.carRepository.createCar(carData);

    await this.carRepository.createCarHistory({
      car_id: newCar.id,
      user_id: userId,
      action: 'created'
    });

    return newCar;
  }

  public async updateCar(id: string, data: Partial<CarType>, image?: string, userId?: string): Promise<CarType | undefined> {
    const updateData: Partial<CarType> = { ...data };

    if (image) {
      updateData.image = image;
    }
    if (userId) {
      updateData.updated_by = userId;
    }
    updateData.updated_at = new Date();

    const updatedCar = await this.carRepository.updateCar(id, updateData);

    if (updatedCar && userId) {
      await this.carRepository.createCarHistory({
        car_id: updatedCar.id,
        user_id: userId,
        action: 'updated'
      });
    }

    return updatedCar;
  } 

  public async deleteCar(id: string, userId: string): Promise<number> {
    const trx = await this.carRepository.startTransaction();

    try {
      const carExists = await this.carRepository.findCarById(id);

      if (!carExists) {
        await trx.rollback();
        return 0;
      }

      await this.carRepository.createCarHistory({
        car_id: id,
        user_id: userId,
        action: 'deleted'
      }, trx);

      const deletedCount = await this.carRepository.deleteCarById(id, trx);

      await trx.commit();
      return deletedCount;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  public async getCarHistories(): Promise<CarHistoryModel[]> {
    return this.carRepository.getCarHistories();
  }
}
