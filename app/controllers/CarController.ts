import { Request, Response } from 'express';
import { CarService } from '../services/CarService';
import cloudinary from '../middleware/cloudinary';
import { CarType } from '../models/CarModel';

const carService = new CarService();

export class CarController {
  public static async getCars(req: Request, res: Response): Promise<Response> {
    try {
      const cars = await carService.getCars();
      return res.status(200).json({  status: "Success", message: "Send cars data", data: cars });
    } catch (error) {
      console.error("Error fetching cars:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public static async store(req: Request, res: Response): Promise<Response> {
    const { 
      plate, 
      manufacture, 
      model, 
      rentPerDay, 
      capacity, 
      description, 
      transmission, 
      type, 
      typeDriver, 
      year, 
      options, 
      specs, 
      availableAt 
    }: CarType = req.body;
    
    const file = req.file;
    const userId = req.user?.id;

    if (!plate || !manufacture || !model || !rentPerDay || !capacity || !description || !transmission || !type ||  !typeDriver || !year || !options || !specs || !availableAt || !file) {
      return res.status(400).json({ status: "Failed", message: 'All fields are required' });
    }

    try {
      const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(fileBase64, { folder: 'cars' });
      const imageUrl = result.secure_url;

      if (!imageUrl) {
        return res.status(500).json({ status: "Failed", message: 'Cannot retrieve image from Cloudinary' });
      }

      const newCar = await carService.createCar({ 
        plate, 
        manufacture, 
        model, 
        rentPerDay, 
        capacity, 
        description, 
        transmission, 
        type, 
        typeDriver, 
        year, 
        options, 
        specs, 
        availableAt 
      }, imageUrl, userId);

      return res.status(201).json({ status: "Success", message: 'Store car successfully', data: newCar });
    } catch (error) {
      console.error('Error storing car:', error);
      return res.status(500).json({ status: "Failed", message: 'Store car failed' });
    }
  }

  public static async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { 
      plate, 
      manufacture, 
      model, 
      rentPerDay, 
      capacity, 
      description, 
      transmission, 
      type, 
      typeDriver, 
      year, 
      options, 
      specs, 
      availableAt 
    }: CarType = req.body;
    const file = req.file;
    const userId = req.user?.id;

    try {
      let imageUrl: string | undefined;

      if (file) {
        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(fileBase64, { folder: 'cars' });
        imageUrl = result.secure_url;

        if (!imageUrl) {
          return res.status(500).json({ message: 'Cannot retrieve image from Cloudinary' });
        }
      }

      const car = await carService.updateCar(id, { 
        plate, 
        manufacture, 
        model, 
        rentPerDay, 
        capacity, 
        description, 
        transmission, 
        type, 
        typeDriver, 
        year, 
        options, 
        specs, 
        availableAt 
      }, imageUrl, userId);

      if (!car) {
        return res.status(404).json({ status: "Failed", message: "Car not found" });  
      }

      return res.status(201).json({ status: "Success", message: "Car successfully updated", data: car });
    } catch (error) {
      console.error('Error updating car:', error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  }

  public static async deleteCar(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
      const deletedCount = await carService.deleteCar(id, userId);

      if (deletedCount === 0) {
        return res.status(404).json({ message: "Car not found" });
      }

      return res.status(201).json({ status: "Success", message: "Car successfully deleted" });
    } catch (error) {
      console.error('Error deleting car:', error);
      return res.status(500).json({ status: "Failed", message: "Internal Server Error" });
    }
  }

  public static async carHistories(req: Request, res: Response): Promise<Response> {
    try {
      const carHistories = await carService.getCarHistories();
      return res.status(200).json({ status: "Success", message: "Send car histories", data: carHistories });
    } catch (error) {
      console.error("Error fetching car histories:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
