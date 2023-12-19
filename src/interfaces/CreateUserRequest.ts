import { UserRole } from "@prisma/client";

export default interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}