/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

export async function authorize(req: any, res: Response, next: NextFunction) {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split('Bearer ')[1];
        const tokenPayload = jwt.verify(token, 'rahasia') as any;

        const user = await UserModel.query().findOne({ id: tokenPayload.id });
        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({ message: "unauthotized" })   
    }
}

export function checkAccess(role: string[]) {
    return (req: any, res: Response, next: NextFunction) => {
        if (!role.includes(req.user.role)) {
            return res.status(401).json({
                message: 'You cannot access this feature'
            })
        }

        next();
    }
}