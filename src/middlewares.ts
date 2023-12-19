import { NextFunction, Request, Response } from 'express';
import ErrorResponse from './interfaces/ErrorResponse';
import { prisma } from './db';
import * as jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import { User } from '@prisma/client';

export interface UserRequest<T = any, K = any, N = any> extends Request<T, K, N> {
    user?: User;
}

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    console.error(req)
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const jwtSecret = process.env.JWT_SECRET as Secret | undefined;

        if (!jwtSecret) return res.status(500).json({ message: 'JWT secret is not defined' });

        const decoded = jwt.verify(token, jwtSecret) as any;
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } })

        if(!user) return res.status(401).json({ message: 'Unauthorized' });

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export function isAdmin(req: UserRequest, res: Response, next: NextFunction) {
    const user = req.user;
    if (user?.role === 'ADMIN') {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
}