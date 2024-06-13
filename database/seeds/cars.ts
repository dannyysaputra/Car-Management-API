import { Knex } from 'knex';
import * as fs from 'fs/promises';
import * as path from 'path';
import cloudinary from '../../app/middleware/cloudinary';

interface Car {
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
  availableAt: string;
  available: boolean;
}

export async function seed(knex: Knex): Promise<void> {
  try {
    // Deletes ALL existing entries
    // await knex('cars').del();

    // Reads data from JSON file
    const carsData = await fs.readFile(path.resolve(__dirname, '../../cars2.min.json'), 'utf8');
    const cars: Car[] = JSON.parse(carsData);

    // Log the number of cars read from the file
    console.log(`Read ${cars.length} cars from JSON file`);

    // Upload images to Cloudinary and format the data for insertion
    const formattedCars = await Promise.all(cars.map(async car => {
      try {
        const result = await cloudinary.uploader.upload(car.image, { folder: 'cars' });
        const imageUrl = result.secure_url;

        const optionsArray = car.options;
        const specsArray = car.specs;

        // Convert arrays to JSON strings
        const optionsJson = JSON.stringify(optionsArray);
        const specsJson = JSON.stringify(specsArray);

        // Format for PostgreSQL array literal
        const optionsPGFormat = `{${optionsJson.slice(1, -1)}}`; // Remove brackets []
        const specsPGFormat = `{${specsJson.slice(1, -1)}}`; // Remove brackets []

        // Log the image URL
        console.log(`Uploaded image for car ${car.image} to ${imageUrl}`);

        return {
          id: car.id,
          plate: car.plate,
          manufacture: car.manufacture,
          model: car.model,
          image: imageUrl,
          rentPerDay: car.rentPerDay,
          capacity: car.capacity,
          description: car.description,
          transmission: car.transmission,
          type: car.type,
          year: car.year,
          options: optionsPGFormat,  // Convert array to JSON string
          specs: specsPGFormat,      // Convert array to JSON string
          availableAt: new Date(car.availableAt),
          available: car.available,
          created_by: '46f5ff40-701e-4650-b110-dcc9d16cb1a7',
          updated_by: '46f5ff40-701e-4650-b110-dcc9d16cb1a7',
          deleted_by: null,
          created_at: new Date(),
          updated_at: new Date()
        };
      } catch (error) {
        console.error(`Error uploading image for car ${car.image}:`, error);
        throw error;
      }
    }));

    // Inserts seed entries
    await knex('cars').insert(formattedCars);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}
