import express, { Request, Response } from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import { prisma } from '../db';

const router = express.Router();

router.get<{}, MessageResponse>('/:id', async (req: Request, res: Response<MessageResponse>) => {
    try {
        const screenId = req.params.id;
        const seats = await prisma.seat.findMany({
            where: {
                screeningId: screenId,
            }
        });

        const messageResponse: MessageResponse = {
            seats: seats,
        };

        res.json(messageResponse);
    } catch (error) {
        console.error('Error fetching movie`s seats:', error);
        res.status(500).json({ message: 'Error fetching movie`s seats' });
    }
});

export default router;