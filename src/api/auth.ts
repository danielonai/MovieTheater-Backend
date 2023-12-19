import express, { Request, Response } from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import { prisma } from '../db';
import CreateUserRequest from '../interfaces/CreateUserRequest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '10h' });
};

router.get<{}, MessageResponse>('/', async (req: Request, res: Response<MessageResponse>) => {
    try {
        const movies = await prisma.movie.findMany({
            where: {
                deleted: false,
            },
            include: {
                screenings: true,
            }
        });

        const messageResponse: MessageResponse = {
            movies: movies.map((movie) => ({
                ...movie,
            })),
        };

        res.json(messageResponse);
    } catch (error) {
        console.error('Error fetching mvoies:', error);
        res.status(500).json({ message: 'Error fetching movies' });
    }
});

router.post<{}, MessageResponse>('/register', async (req: Request<{}, {}, CreateUserRequest>, res: Response<MessageResponse>) => {
    try {
        const { username, email, password } = req.body;
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });
    
        const token = generateToken(user.id);
        const messageResponse: MessageResponse = {
            token: token,
            user: user
        };

        res.status(201).json(messageResponse);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post<{}, MessageResponse>('/login', async (req: Request, res: Response<MessageResponse>) => {
    try {
        const { email, password } = req.body;
    
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
    
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = generateToken(user.id);
        const messageResponse: MessageResponse = {
            token: token,
            user: user
        };

        res.status(200).json(messageResponse);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
