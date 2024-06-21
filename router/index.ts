import { Router } from 'express';
import { CarController } from '../app/controllers/CarController';
import upload from '../app/middleware/multer';
import { UserController } from '../app/controllers/UserController';
import { authorize, checkAccess } from '../app/middleware/authorize';

import swaggerui from 'swagger-ui-express';
import swaggerDocument from '../openapi.json';

export const router = Router();

// Users
router.post('/register', UserController.register);
router.post('/create-admin', authorize, checkAccess(['superadmin']), UserController.createAdmin);
router.post('/login', UserController.login);    
router.get('/whoami', authorize, UserController.whoAmI);

// Cars
router.post('/cars', authorize, checkAccess(['admin', 'superadmin']), upload.single('image'), CarController.store);
router.get('/cars', CarController.getCars);
router.get('/cars/:id', authorize, checkAccess(['admin', 'superadmin']), CarController.getCarById);
router.put('/cars/:id', authorize, checkAccess(['admin', 'superadmin']), upload.single('image'), CarController.update);
router.delete('/cars/:id', authorize, checkAccess(['admin', 'superadmin']), CarController.deleteCar);

router.get('/car-histories', authorize, checkAccess(['admin', 'superadmin']), CarController.carHistories);

// open api
router.use('/api-docs', swaggerui.serve);
router.get('/api-docs', swaggerui.setup(swaggerDocument));
router.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
})