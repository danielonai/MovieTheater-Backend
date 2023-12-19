import { SeatState } from "@prisma/client";

export default interface CreateSeatRequest {
    state: SeatState;
    row: string;
    column: string;
    screenId: string;
    bookingId: string;
    seatId: string;
}