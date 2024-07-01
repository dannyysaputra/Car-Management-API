/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
// import app from '../index';
import { CarController } from '../app/controllers/CarController';
import upload from '../app/middleware/multer';
import express from 'express';
import knexInstance from "../database";
import { Model } from 'objection';
import { CarModel } from '../app/models/CarModel';

const app = express();
Model.knex(knexInstance);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mockAuthorize = jest.fn((req, res, next) => next());
const mockCheckAccess = jest.fn((roles) => (req: any, res: any, next: () => any) => next());
const mockUpload = upload.single('image');

app.post('/api/v1/cars', mockAuthorize, mockCheckAccess(['superadmin']), mockUpload, CarController.store);
app.get('/api/v1/cars', CarController.getCars);
app.get('/api/v1/cars/:id', mockAuthorize, mockCheckAccess(['superadmin']), CarController.getCarById);

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
    available: true,
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
            .get('/api/v1/cars/22c969a7-04ce-4efb-a479-7ab3bc094cb9')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: "Success",
                        message: "Car found",
                        data: {
                            id: "22c969a7-04ce-4efb-a479-7ab3bc094cb9",
                            manufacture: "Lincoln",
                            model: "MKS",
                            rentPerDay: 1000000,
                            capacity: 2,
                            transmission: "Automanual",
                            type: "Regular Cab Pickup",
                            typeDriver: "tanpa-sopir",
                            year: 2015,
                            plate: "ENW-7713",
                            description: " Energy absorbing steering column. 3-point ELR/ALR front passenger seat belt w/pretensioner & load limiter.",
                            image: "https://res.cloudinary.com/dkjoe7ehu/image/upload/v1718253844/cars/zdjrcto0c5nay3cuuwpc.jpg",
                            options: expect.arrayContaining([
                                "Alarm",
                                "Airbag: Passenger",
                                "Cassette Player",
                                "Moonroof/Sunroof",
                                "Antilock Brakes"
                            ]),
                            specs: expect.arrayContaining([
                                "Energy absorbing steering column",
                                "3-point ELR/ALR front passenger seat belt w/pretensioner & load limiter",
                                "HomeLink universal transceiver",
                                "Battery saver",
                                "(2) aux 12V pwr outlets -inc: (1) in center console, (1) w/cigarette lighter",
                                "LATCH-ready child seat anchor system",
                                "Passenger assist handles",
                                "XM satellite radio receiver -inc: 90 day trial subscription"
                            ]),
                            created_at: '2024-06-13T04:44:05.108Z',
                            updated_at: '2024-06-21T11:12:39.909Z',
                            created_by: '1f0da32d-4e44-437e-9a9a-d0f4044db615',
                            updated_by: '1f0da32d-4e44-437e-9a9a-d0f4044db615',
                            deleted_by: null,
                            available: false, 
                            availableAt: '2024-06-12T20:30:22.421Z'
                        }
                    })
                )
            })
    })
})

afterAll(async () => {
    await CarModel.query().where('plate', car.plate).del()
    server.close();
})