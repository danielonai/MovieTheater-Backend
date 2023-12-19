import { UserRole } from "@prisma/client";

export default interface UpdateUserRequest {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}