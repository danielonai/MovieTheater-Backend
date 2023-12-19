import { SeatState } from "@prisma/client";

export default interface UpdateSeatRequest {
    state: SeatState;
    row: string;
    number: string;
    movieId: string;
}