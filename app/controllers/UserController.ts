/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ status: "Failed", message: 'Email not found' });
    }

    const isPasswordCorrect = await userService.verifyPassword(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ status: "Failed", message: 'Wrong password' });
    }

    const token = await userService.generateToken(user);

    return res.status(200).json({
      status: 'Success',
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  }

  public static async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide a valid input"
      })
    }

    try {
      const user = await userService.registerUser({ name, email, password, avatar, role: 'user' });

      return res.status(201).json({
        status: 'Success',
        message: 'Successfully registered',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    } catch (e) {
      return res.status(409).json({
        status: "Failed",
        message: 'User already exists'
      });
    }
  }

  public static async createAdmin(req: Request, res: Response): Promise<Response> {
    const { name, email, password, avatar } = req.body;
    const userId = req.user?.id;

    try {
      const user = await userService.createAdminUser({ name, email, password, avatar }, userId);

      return res.status(201).json({
        status: "Success",
        message: 'Admin successfully registered',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
    } catch (e) {
      return res.status(409).json({
          status: 'Failed',
          message: 'User already exists'
      });
    }
  }

  public static async whoAmI(req: any, res: Response) {
    res.status(200).json({
      status: 'OK',
      message: "Success",
      data: req.user
    });
  }
}
