/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import app from '../app/index';
import { UserModel } from '../app/models/UserModel';
import { UserController } from '../app/controllers/UserController';
import express from 'express';

const mockAuthorize = jest.fn((req, res, next) => next());
const mockCheckAccess = jest.fn((roles) => (req: any, res: any, next: () => any) => next());

const mockApp = express();
mockApp.use(express.json());
mockApp.post('/api/v1/create-admin', mockAuthorize, mockCheckAccess(['superadmin']), UserController.createAdmin);
mockApp.get('/api/v1/whoami', mockAuthorize, UserController.whoAmI);

let server: any;

const user = {
    name: 'test123',
    email: 'test123@example.com',
    password: 'test123',
    role: 'superadmin',
    avatar: null
}

const admin = {
    name: 'test321',
    email: 'test321@example.com',
    password: 'test321',
    role: 'admin',
    avatar: null
}

beforeAll((done) => {
    server = app.listen(8000, () => {
        done();
    })
})

describe('POST /api/v1/register', () => {
    // 1. success registration
    it('should response with 201 status code', async () => {
        await request(server)
            .post('/api/v1/register')
            .send(user)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(201)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: "Success",
                        message: "Successfully registered",
                        data: {
                            id: expect.any(String),
                            name: user.name,
                            email: user.email,
                        }
                    })
                )
            })
    })
    
    // 2. user already exists
    it('should response with 409 status code', async () => {
        await request(server)
            .post('/api/v1/register')
            .send(user)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(409)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: 'Failed',
                        message: "User already exists"
                    })
                )
            })
    })

    // 3. invalid input
    it('should response with 400 status code', async () => {
        await request(server)
            .post('/api/v1/register')
            .send({
                ...user,
                email: null
            })
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(400)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        message: "Please provide a valid input"
                    })
                )
            })
    })
})

describe('POST /api/v1/login', () => {
    // 1. success login
    it('should response with 200 status code', async () => {
        await request(server)
            .post('/api/v1/login')
            .send(user)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: 'Success',
                        message: "Login successful",
                        data: {
                            id: expect.any(String),
                            name: user.name,
                            email: user.email,
                            token: expect.any(String),
                            role: expect.any(String),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        }
                    })
                )
            })
    }, 10000)

    // 2. Email not found
    it('should response with 404 status code', async () => {
        await request(server)
            .post('/api/v1/login')
            .send({
                ...user,
                email: 'testa@example.com'
            })
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(404)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: "Failed",
                        message: 'Email not found'
                    })
                )
            })
    }, 10000)

    // 3. Wrong password
    it('should response with 401 status code', async () => {
        await request(server)
            .post('/api/v1/login')
            .send({
                ...user,
                password: "4321"
            })
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(401)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: "Failed",
                        message: "Wrong password"
                    })
                )
            })
    }, 10000)
})

describe('POST /api/v1/create-admin', () => {
    // 1. success regist admin
    it('should response with 201 status code', async () => {
        await request(mockApp)
            .post('/api/v1/create-admin')
            .send(admin)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(201)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: "Success",
                        message: "Admin successfully registered",
                        data: {
                            id: expect.any(String),
                            name: admin.name,
                            email: admin.email,
                        }
                    })
                )
            })
    }, 10000)
    
    // 2. user already exists
    it('should response with 409 status code', async () => {
        await request(mockApp)
            .post('/api/v1/create-admin')
            .send(admin)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any; }) => {
                expect(res.statusCode).toBe(409)    
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: "Failed",
                        message: "User already exists"
                    })
                )
            })
    }, 10000)
})

describe('GET /api/v1/whoami', () => {
    // 1. check data user
    it('should response with 200 status code', async () => {
        await request(mockApp)
            .get('/api/v1/whoami')
            .send(admin)
            .set('Accept', 'application/json')
            .then((res: { statusCode: number; body: any }) => {
                expect(res.statusCode).toBe(200)
                expect(res.body).toEqual(
                    expect.objectContaining({
                        status: 'OK',
                        message: 'Success',
                        // data: {
                        //     id: expect.any(Number),
                        //     name: user.name,
                        //     email: user.email,
                        //     avatar: expect.any(String),
                        //     role: expect.any(String),
                        //     created_by: expect.any(String),
                        //     updated_by: expect.any(String),
                        //     created_at: expect.any(String),
                        //     updated_at: expect.any(String)
                        // }
                    })
                )
            })
    }, 10000)
})

afterAll(async () => {
    await UserModel.query().where('email', user.email).del()
    await UserModel.query().where('email', admin.email).del()
    server.close();
})