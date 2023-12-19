import express, { Request, Response } from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import { isAdmin } from '../middlewares';
import { prisma } from '../db';

type Create = {
    dates: Date[];
}

const router = express.Router();
//Delete Screenings
router.post<{ id: string }, MessageResponse>('/:id', isAdmin, async (req: Request<{ id: string }, {}, Create>, res: Response<MessageResponse>) => {
    try {
        const movieId = req.params.id;
        const { dates } = req.body;

        const createdScreenings = await prisma.screening.deleteMany({
            where: {
                movieId: movieId,
                AND: {
                    date: {
                        in: dates,
                    },
                }
            },
        });

        const messageResponse: MessageResponse = {
            message: `${createdScreenings.count} Screenings deleted successfully`,
        };

        res.json(messageResponse);
    } catch (error) {
        console.error('Error deleting screenings:', error);
        res.status(500).json({ message: 'Error deleting screenings' });
    }
});

export default router;