import { Booking, Seat } from "@prisma/client";

export default interface CreateScreeningRequest {
	screenings: screening[];
}

interface screening {
	movieId: string;
	date: Date;
	seats?: Seat[];
	Booking?: Booking;
}
