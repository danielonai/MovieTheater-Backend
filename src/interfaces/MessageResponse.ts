import { Booking, Movie, Screening, Seat, User, UserRole } from "@prisma/client";

export default interface MessageResponse {
  error?: string;
  message?: string;
  token?: string;
  movies?: Movie[];
  movie?: Movie;
  users?: OmitUser[];
  user?: OmitUser;
  seats?: Seat[];
  seat?: Seat;
  booking?: Booking;
  screening?: Screening;
}

type OmitUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}