/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
// import app from '../index';
import { CarController } from '../app/controllers/CarController';
import upload from '../app/middleware/multer';
import express from 'express';
import { Model } from 'objection';
import { CarModel } from '../app/models/CarModel';
import Knex from 'knex';
import configs from '../knexfile';

const app = express();
const environment = process.env.NODE_ENV || 'development';
const knexConfig = configs[environment];

console.log(environment);
console.log(knexConfig);

const knexInstance = Knex(knexConfig);
Model.knex(knexInstance);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mockAuthorize = jest.fn((req, res, next) => next());
const mockCheckAccess = jest.fn((roles) => (req: any, res: any, next: () => any) => next());
const mockUpload = upload.single('image');

app.post('/api/v1/cars', mockAuthorize, mockCheckAccess(['superadmin']), mockUpload, CarController.store);
app.get('/api/v1/cars/:id', mockAuthorize, mockCheckAccess(['superadmin']), CarController.getCarById);
app.put('/api/v1/cars/:id', mockAuthorize, mockCheckAccess(['superadmin']), mockUpload, CarController.update);

let server: any;

const car = {
    plate: 'D 2231 LA',
    manufacture: 'Toyota',
    model: 'Innova',
    rentPerDay: 1000000,
    capacity: 6,
    description: 'Ini deskripsi',
    transmission: 'Manual',
    type: 'Family-car',
    typeDriver: 'tanpa-supir',
    year: 2020,
    options: "['CD', 'Cruise control']",
    specs: "['First aid', 'rear window']",
    availableAt: '2024-06-14 14:02:47.278 +0700',
    available: false,
    userId: '1f0da32d-4e44-437e-9a9a-d0f4044db615',
}

const filePath = './test/images/test-car.jpg';

beforeAll((done) => {
    server = app.listen(7000, () => {
        done();
    })
})

describe('POST /api/v1/cars', () => {
    // 1. success add new car
    it('should return 201 status code', async () => {
        await request(app)
            .post('/api/v1/cars')
            .attach('image', filePath) // Attach the mock file
            .field('plate', car.plate)
            .field('manufacture', car.manufacture)
            .field('model', car.model)
            .field('rentPerDay', car.rentPerDay)
            .field('capacity', car.capacity)
            .field('description', car.description)
            .field('transmission', car.transmission)
            .field('type', car.type)
            .field('typeDriver', car.typeDriver)
            .field('year', car.year)
            .field('available', car.available)
            .field('availableAt', car.availableAt)
            .field('options', car.options)
            .field('specs', car.specs)
            // .send(car)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(201)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: 'Success',
                        message: 'Store car successfully',
                        data: {
                            plate: car.plate,
                            manufacture: car.manufacture,
                            model: car.model,
                            rentPerDay: car.rentPerDay.toString(),
                            capacity: car.capacity.toString(),
                            description: car.description,
                            transmission: car.transmission,
                            type: car.type,
                            typeDriver: car.typeDriver,
                            year: car.year.toString(),
                            available: car.available.toString(),
                            availableAt: expect.any(String),
                            options: JSON.parse(car.options.replace(/'/g, '"')),
                            specs: JSON.parse(car.specs.replace(/'/g, '"')),
                            image: expect.any(String), 
                            id: expect.any(String)
                        }
                    })
                )
            })
    }, 10000);

    // 2. All field required
    it('should response with 400 status code', async () => {
        await request(app)
            .post('/api/v1/cars')
            .attach('image', filePath) // Attach the mock file
            .field('plate', car.plate)
            .field('manufacture', car.manufacture)
            .field('model', car.model)
            .field('rentPerDay', car.rentPerDay)
            .field('capacity', car.capacity)
            .field('description', car.description)
            .field('type', car.type)
            .field('typeDriver', car.typeDriver)
            .field('year', car.year)
            .field('available', car.available)
            .field('availableAt', car.availableAt)
            .field('options', car.options)
            .field('specs', car.specs)
            // .send(car)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: 'Failed',
                        message: 'All fields are required',
                    })
                )
            })
    }, 10000)
})

describe('Get /api/v1/cars/id', () => {
    // 1. return car
    it('should response with 200 status code', async () => {
        await request(app)
            .get('/api/v1/cars/08cbd537-497f-4305-b7b4-e7493c703a2c')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: "Success",
                        message: "Car found",
                        data: {
                            id: "08cbd537-497f-4305-b7b4-e7493c703a2c",
                            manufacture: "Ford",
                            model: "F150",
                            rentPerDay: 600000,
                            capacity: 6,
                            transmission: "Automatic",
                            type: "Convertible",
                            typeDriver: "dengan-sopir",
                            year: 2021,
                            plate: "ZAG-8112",
                            description: "",
                            image: "https://res.cloudinary.com/dkjoe7ehu/image/upload/v1718253842/cars/ltruyqenyp99ljhoswvw.jpg",
                            options: expect.arrayContaining([
                                "CD (Single Disc)",
                                "Airbag: Driver",
                                "Antilock Brakes",
                                "CD (Single Disc)",
                                "A/C: Rear",
                                "Memory Seats",
                                "Third Row Seats"
                            ]),
                            specs: expect.arrayContaining([
                                "All-position 3-point seat belts -inc: outboard pretensioners & force limiters, dual front pwr shoulder height adjusters, rear outboard emergency auto locking retractors, driver emergency locking retractor",
                                "Body color door handles",
                                "Front & rear passenger folding assist grips",
                                "Rear-window defogger w/auto-off timer",
                                "160-amp alternator",
                                "Body color door handles",
                                "Battery saver",
                                "First aid kit",
                                "Immobilizer system"
                            ]),
                            created_at: '2024-06-13T04:44:02.978Z',
                            updated_at: '2024-06-13T04:44:02.978Z',
                            created_by: '1f0da32d-4e44-437e-9a9a-d0f4044db615',
                            updated_by: '1f0da32d-4e44-437e-9a9a-d0f4044db615',
                            deleted_by: null,
                            available: false, 
                            availableAt: '2024-06-14T07:02:47.278Z'
                        }
                    })
                )
            })
    })
})

describe('Put /api/v1/cars/id', () => {
    // 1. success add new car
    it('should return 201 status code', async () => {
        await request(app)
            .put('/api/v1/cars/e76e884b-8f3e-4b90-a717-9239676d0191')
            .attach('image', filePath) // Attach the mock file
            .field('plate', "D 2343 PL")
            .field('manufacture', car.manufacture)
            .field('model', car.model)
            .field('rentPerDay', car.rentPerDay)
            .field('capacity', car.capacity)
            .field('description', car.description)
            .field('transmission', car.transmission)
            .field('type', car.type)
            .field('typeDriver', car.typeDriver)
            .field('year', car.year)
            .field('available', car.available)
            .field('availableAt', car.availableAt)
            .field('options', car.options)
            .field('specs', car.specs)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(201)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: 'Success',
                        message: 'Car successfully updated',
                        data: {
                            available: car.available,
                            plate: "D 2343 PL",
                            manufacture: car.manufacture,
                            model: car.model,
                            rentPerDay: car.rentPerDay,
                            capacity: car.capacity,
                            deleted_by: null,
                            description: car.description,
                            transmission: car.transmission,
                            type: car.type,
                            typeDriver: car.typeDriver,
                            year: car.year,
                            availableAt: expect.any(String),
                            created_at: expect.any(String),
                            updated_at: expect.any(String),
                            updated_by: expect.any(String),
                            created_by: expect.any(String),
                            options: JSON.parse(car.options.replace(/'/g, '"')),
                            specs: JSON.parse(car.specs.replace(/'/g, '"')),
                            image: expect.any(String), 
                            id: expect.any(String)
                        }
                    })
                )
            })
    }, 10000);

    // 2. car not found
    it('should return 404 status code', async () => {
        await request(app)
            .put('/api/v1/cars/e76e884b-8f3e-4b90-a717-9239676d0100')
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(404)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: 'Failed',
                        message: 'Car not found'
                    })
                )
            })
    }, 10000);
})

afterAll(async () => {
    await CarModel.query().where('plate', car.plate).del()
    server.close();
})