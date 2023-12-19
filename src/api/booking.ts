import express, { Response } from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import { prisma } from '../db';
import { UserRequest } from '../middlewares';
import CreateBookingRequest from '../interfaces/CreateBookingRequest';

const router = express.Router();

router.post<{}, MessageResponse>('/order', async (req: UserRequest<{}, {}, CreateBookingRequest>, res: Response<MessageResponse>) => {
    try {
        const { screenId, column, row } = req.body;

        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: req.user?.id
            }
        });
        
        const booking = await prisma.booking.create({
            data: {
                bookedAt: new Date(),
                screeningId: screenId!,
                seats: {
                    create: {
                        Screening: {
                            connect: {
                                id: screenId,
                            },
                        },
                        column: column,
                        row: row,
                        state: "OCCUPIED",
                    }
                },
                userId: user.id
            },
        });
        const messageResponse: MessageResponse = {
            booking: booking,
        };

        res.json(messageResponse);
    } catch (error) {
        console.error('Error ordering:', error);
        res.status(500).json({ message: 'Error ordering' });
    }
});

export default router;
